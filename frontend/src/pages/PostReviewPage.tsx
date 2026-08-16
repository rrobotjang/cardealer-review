import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../api'
import { useAuth } from '../auth'
import type { CarMake, Dealership } from '../types'

export default function PostReviewPage() {
  const { id } = useParams()
  const dealerId = Number(id)

  const { username, openLogin } = useAuth()
  const [dealer, setDealer] = useState<Dealership | null>(null)
  const [makes, setMakes] = useState<CarMake[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [review, setReview] = useState('')
  const [purchase, setPurchase] = useState(false)
  const [purchaseDate, setPurchaseDate] = useState('')
  const [carMake, setCarMake] = useState('')
  const [carModel, setCarModel] = useState('')
  const [carYear, setCarYear] = useState('')

  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [dealerData, makesData] = await Promise.all([
        api.dealership(dealerId),
        api.carMakes(),
      ])
      setDealer(dealerData)
      setMakes(makesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review form data.')
    }
  }, [dealerId])

  useEffect(() => {
    void load()
  }, [load])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username) {
      openLogin()
      return
    }
    setError(null)
    setBusy(true)
    try {
      await api.addReview(dealerId, {
        name: username,
        dealership: dealerId,
        review: review.trim(),
        purchase,
        purchase_date: purchaseDate || null,
        car_make: carMake || null,
        car_model: carModel.trim() || null,
        car_year: carYear ? Number(carYear) : null,
      })
      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        openLogin()
        setError('Your session has expired. Please log in again.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to submit your review.')
      }
    } finally {
      setBusy(false)
    }
  }

  if (error && !dealer) {
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

  if (!dealer || !makes) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </Container>
    )
  }

  if (success) {
    return (
      <Container className="py-4" style={{ maxWidth: '720px' }}>
        <Alert variant="success" className="text-center py-4">
          <i className="bi bi-check-circle-fill display-6 d-block mb-2" aria-hidden="true" />
          <h4 className="alert-heading">Thank you for your review!</h4>
          <p className="mb-0">
            Your review for <strong>{dealer.short_name}</strong> has been published.
          </p>
        </Alert>
        <div className="text-center">
          <Link to={`/dealers/${dealerId}`} className="btn btn-primary">
            View reviews
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4" style={{ maxWidth: '720px' }}>
      <Link to={`/dealers/${dealerId}`} className="btn btn-link ps-0 mb-3">
        <i className="bi bi-arrow-left me-1" aria-hidden="true" />
        Back to {dealer.short_name}
      </Link>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h1 className="h3 mb-1">Write a review</h1>
          <p className="text-muted mb-4">
            Reviewing <strong>{dealer.full_name}</strong> ({dealer.address})
          </p>

          {!username && (
            <Alert variant="warning" className="d-flex align-items-center justify-content-between">
              <span>You need to log in to write a review.</span>
              <Button variant="primary" size="sm" onClick={openLogin}>
                Log in
              </Button>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}

          <Form onSubmit={submit}>
            <Form.Group className="mb-3" controlId="review-text">
              <Form.Label>
                Your review <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell others about your experience — price, service, negotiation, delivery…"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="review-purchase">
              <Form.Check
                type="checkbox"
                label="I purchased a vehicle from this dealership"
                checked={purchase}
                onChange={(e) => setPurchase(e.target.checked)}
              />
            </Form.Group>

            {purchase && (
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="review-purchase-date">
                    <Form.Label>Purchase date</Form.Label>
                    <Form.Control
                      type="date"
                      value={purchaseDate}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="review-car-make">
                    <Form.Label>Car make</Form.Label>
                    <Form.Select
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      aria-label="Select car make"
                    >
                      <option value="">Select make…</option>
                      {makes.map((make) => (
                        <option key={make.id} value={make.name}>
                          {make.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="review-car-model">
                    <Form.Label>Car model</Form.Label>
                    <Form.Control
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="e.g. Accord"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="review-car-year">
                    <Form.Label>Model year</Form.Label>
                    <Form.Control
                      type="number"
                      min={1980}
                      max={2030}
                      value={carYear}
                      onChange={(e) => setCarYear(e.target.value)}
                      placeholder="e.g. 2024"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Button type="submit" variant="primary" disabled={busy || !username}>
              {busy ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                'Submit review'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
