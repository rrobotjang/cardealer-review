import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import type { Dealership, Review, Sentiment } from '../types'

const SENTIMENT_STYLES: Record<Sentiment, string> = {
  positive: 'badge-soft-success text-success',
  negative: 'badge-soft-danger text-danger',
  neutral: 'badge-soft-secondary text-secondary',
}

const SENTIMENT_LABELS: Record<Sentiment, string> = {
  positive: 'Positive',
  negative: 'Negative',
  neutral: 'Neutral',
}

function SentimentBadge({ sentiment }: { sentiment: Sentiment | null }) {
  if (!sentiment) {
    return null
  }
  return (
    <Badge bg="light" className={SENTIMENT_STYLES[sentiment]}>
      <i
        className={`bi ${
          sentiment === 'positive'
            ? 'bi-emoji-smile'
            : sentiment === 'negative'
              ? 'bi-emoji-frown'
              : 'bi-emoji-neutral'
        } me-1`}
        aria-hidden="true"
      />
      {SENTIMENT_LABELS[sentiment]}
    </Badge>
  )
}

function formatDate(value?: string): string {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function DealerDetailPage() {
  const { id } = useParams()
  const dealerId = Number(id)

  const [dealer, setDealer] = useState<Dealership | null>(null)
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [dealerData, reviewsData] = await Promise.all([
        api.dealership(dealerId),
        api.dealerReviews(dealerId),
      ])
      setDealer(dealerData)
      setReviews(reviewsData.reviews)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dealership data.')
    }
  }, [dealerId])

  useEffect(() => {
    setDealer(null)
    setReviews(null)
    void load()
  }, [load])

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="d-flex align-items-center justify-content-between">
          <span>{error}</span>
          <Button variant="outline-danger" size="sm" onClick={() => void load()}>
            Retry
          </Button>
        </Alert>
        <Link to="/dealers" className="btn btn-link ps-0">
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          Back to dealerships
        </Link>
      </Container>
    )
  }

  if (!dealer || !reviews) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </Container>
    )
  }

  const positive = reviews.filter((r) => r.sentiment === 'positive').length
  const negative = reviews.filter((r) => r.sentiment === 'negative').length
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${dealer.lat},${dealer.long}`

  return (
    <Container className="py-4">
      <Link to="/dealers" className="btn btn-link ps-0 mb-3">
        <i className="bi bi-arrow-left me-1" aria-hidden="true" />
        Back to dealerships
      </Link>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
            <div>
              <h1 className="mb-1">{dealer.short_name}</h1>
              <p className="text-muted mb-2">{dealer.full_name}</p>
              <p className="mb-2">
                <i className="bi bi-geo-alt me-1" aria-hidden="true" />
                {dealer.address} {dealer.zip}
              </p>
            </div>
            <div className="text-end">
              <div className="d-flex gap-2 justify-content-end mb-2">
                <Badge bg="success" className="badge-soft-success">
                  {positive} positive
                </Badge>
                <Badge bg="danger" className="badge-soft-danger">
                  {negative} negative
                </Badge>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                <i className="bi bi-map me-1" aria-hidden="true" />
                View on map
              </a>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="h4 mb-0">Reviews ({reviews.length})</h2>
        <Link to={`/dealers/${dealerId}/review`} className="btn btn-primary">
          <i className="bi bi-pencil-square me-1" aria-hidden="true" />
          Write a review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <Alert variant="info">
          No reviews yet for this dealership.{' '}
          <Link to={`/dealers/${dealerId}/review`}>Be the first to write one.</Link>
        </Alert>
      ) : (
        <Row className="g-3">
          {reviews.map((review) => (
            <Col lg={6} key={review._id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="fw-semibold">
                        <i className="bi bi-person me-1" aria-hidden="true" />
                        {review.name}
                      </span>
                      <div className="text-muted small">
                        {formatDate(review.createdAt)}
                        {review.purchase && (
                          <span className="ms-2">
                            <i className="bi bi-check-circle text-success me-1" aria-hidden="true" />
                            Verified purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <SentimentBadge sentiment={review.sentiment} />
                  </div>
                  <p className="card-text mb-2">{review.review}</p>
                  {(review.car_make || review.car_model || review.car_year) && (
                    <ListGroup horizontal="sm" className="text-muted small">
                      {review.car_make && (
                        <ListGroup.Item className="border-0 px-0 me-3 bg-transparent">
                          {review.car_make}
                        </ListGroup.Item>
                      )}
                      {review.car_model && (
                        <ListGroup.Item className="border-0 px-0 me-3 bg-transparent">
                          {review.car_model}
                        </ListGroup.Item>
                      )}
                      {review.car_year && (
                        <ListGroup.Item className="border-0 px-0 bg-transparent">
                          {review.car_year}
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
