import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useState, type FormEvent } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Container className="py-4" style={{ maxWidth: '860px' }}>
      <h1 className="mb-3">Contact us</h1>
      <p className="lead text-muted mb-4">
        Questions, feedback, or a dealership that should be listed? We would love to hear
        from you.
      </p>

      <Row className="g-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h6 className="text-primary">
                <i className="bi bi-envelope me-2" aria-hidden="true" />
                Email
              </h6>
              <p className="mb-0 text-muted">support@bestcars.example</p>
            </Card.Body>
          </Card>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="text-primary">
                <i className="bi bi-geo-alt me-2" aria-hidden="true" />
                Office
              </h6>
              <p className="mb-0 text-muted">
                1 Best Cars Plaza
                <br />
                Austin, TX 78701
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {sent ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle-fill display-6 text-success" aria-hidden="true" />
                  <h4 className="mt-3">Message sent</h4>
                  <p className="text-muted mb-0">
                    Thanks, {name || 'friend'}! We will get back to you at{' '}
                    {email || 'your email'} shortly.
                  </p>
                </div>
              ) : (
                <Form onSubmit={submit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="contact-name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="contact-email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="contact-message">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button type="submit" variant="primary">
                        Send message
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
