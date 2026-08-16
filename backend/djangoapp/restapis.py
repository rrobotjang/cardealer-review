"""
Helpers that call the microservices:
  - dealership-api   (Express, GET /dealerships, GET /dealerships/:id)
  - reviews-api       (Express + Mongo, GET /reviews/dealer/:id, POST /review)
  - sentiment-analyzer (serverless, POST /analyze)
"""
import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

TIMEOUT = 5


def _request(method, url, **kwargs):
    try:
        response = requests.request(method, url, timeout=TIMEOUT, **kwargs)
        try:
            data = response.json()
        except ValueError:
            data = response.text
        return response.status_code, data
    except requests.RequestException as exc:
        logger.error("Microservice call failed: %s %s -> %s", method, url, exc)
        return 502, {"error": f"Upstream service unavailable: {exc}"}


def get_dealerships():
    return _request("GET", f"{settings.DEALERSHIP_API_URL}/dealerships")


def get_dealership_by_id(dealer_id):
    return _request("GET", f"{settings.DEALERSHIP_API_URL}/dealerships/{dealer_id}")


def get_dealer_reviews(dealer_id):
    return _request("GET", f"{settings.REVIEWS_API_URL}/reviews/dealer/{dealer_id}")


def analyze_review_sentiment(text):
    status, data = _request("POST", f"{settings.SENTIMENT_API_URL}/analyze", json={"text": text})
    if status != 200 or not isinstance(data, dict) or "sentiment" not in data:
        logger.warning("Sentiment analysis failed, defaulting to neutral")
        return {"sentiment": "neutral"}
    return {"sentiment": data["sentiment"]}


def add_review_to_cf(payload, authorization_header):
    headers = {"Authorization": authorization_header} if authorization_header else {}
    return _request("POST", f"{settings.REVIEWS_API_URL}/review", json=payload, headers=headers)
