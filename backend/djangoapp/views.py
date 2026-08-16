import logging

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from . import restapis
from .models import CarMake
from .serializers import CarMakeSerializer, RegisterSerializer

logger = logging.getLogger(__name__)


@api_view(["GET"])
def dealerships(request):
    code, data = restapis.get_dealerships()
    return Response(data, status=code)


@api_view(["GET"])
def dealership_detail(request, id):
    code, data = restapis.get_dealership_by_id(id)
    if code == 404:
        return Response({"error": "Dealership not found"}, status=404)
    return Response(data, status=code)


@api_view(["GET"])
def dealer_reviews(request, id):
    code, data = restapis.get_dealer_reviews(id)
    return Response(data, status=code)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request, id):
    authorization = request.headers.get("Authorization")
    if not authorization:
        return Response({"error": "Authentication required"}, status=401)

    body = request.data
    required = ("name", "review")
    missing = [field for field in required if not body.get(field)]
    if missing:
        return Response({"error": f"Missing required fields: {', '.join(missing)}"}, status=400)

    payload = {
        "name": body.get("name"),
        "dealership": id,
        "review": body.get("review"),
        "purchase": bool(body.get("purchase", False)),
        "purchase_date": body.get("purchase_date") or None,
        "car_make": body.get("car_make") or None,
        "car_model": body.get("car_model") or None,
        "car_year": body.get("car_year") or None,
    }
    payload["sentiment"] = restapis.analyze_review_sentiment(payload["review"])["sentiment"]

    code, data = restapis.add_review_to_cf(payload, authorization)
    return Response(data, status=code)


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "tokens": {"refresh": str(refresh), "access": str(refresh.access_token)},
        },
        status=201,
    )


@api_view(["POST"])
def sentiment(request):
    text = request.data.get("text", "")
    if not text:
        return Response({"error": "text is required"}, status=400)
    return Response(restapis.analyze_review_sentiment(text))


@api_view(["GET"])
def car_makes(request):
    return Response(CarMakeSerializer(CarMake.objects.all(), many=True).data)
