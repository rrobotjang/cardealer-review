import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { api } from '../api'
import type { Dealership } from '../types'

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealership[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const load = useCallback(async () => {
    setError(null)
    try {
      setDealers(await api.dealerships())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dealerships.')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    if (!dealers) {
      return []
    }
    const q = query.trim().toLowerCase()
    if (!q) {
      return dealers
    }
    return dealers.filter((d) =>
      [d.short_name, d.full_name, d.city, d.state, d.address]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [dealers, query])

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
        <div>
          <h1 className="mb-1">Dealerships</h1>
          <p className="text-muted mb-0">Find a dealership near you and read its reviews.</p>
        </div>
        <Form.Control
          type="search"
          placeholder="Search by name, city or state…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-auto"
          style={{ minWidth: '260px' }}
          aria-label="Search dealerships"
        />
      </div>

      {error && (
        <Alert variant="danger" className="d-flex align-items-center justify-content-between">
          <span>{error}</span>
          <Button variant="outline-danger" size="sm" onClick={() => void load()}>
            Retry
          </Button>
        </Alert>
      )}

      {!dealers && !error && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading dealerships…</span>
          </Spinner>
        </div>
      )}

      {dealers && filtered.length === 0 && (
        <Alert variant="info">
          No dealerships found{query.trim() ? ` for “${query.trim()}”` : ''}. Try a
          different search.
        </Alert>
      )}

      {dealers && filtered.length > 0 && (
        <Row className="g-4">
          {filtered.map((dealer) => (
            <Col md={6} xl={4} key={dealer.id}>
              <Card className="h-100 border-0 shadow-sm card-lift">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{dealer.short_name}</Card.Title>
                    <Badge bg="primary" pill>
                      {dealer.state}
                    </Badge>
                  </div>
                  <Card.Subtitle className="text-muted mb-2">
                    {dealer.full_name}
                  </Card.Subtitle>
                  <Card.Text className="text-muted mb-3">
                    <i className="bi bi-geo-alt me-1" aria-hidden="true" />
                    {dealer.address}
                  </Card.Text>
                  <Link
                    to={`/dealers/${dealer.id}`}
                    className="btn btn-outline-primary mt-auto align-self-start"
                  >
                    View reviews
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
