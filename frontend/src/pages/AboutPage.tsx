import { Col, Container, Row } from 'react-bootstrap'

const VALUES = [
  {
    icon: 'bi-people',
    title: 'Real experiences',
    text: 'Reviews are written by people who actually visited the dealership — no paid placement, no filtered scores.',
  },
  {
    icon: 'bi-graph-up',
    title: 'Transparent scoring',
    text: 'Every review is analyzed with an automated sentiment engine so you can compare dealerships fairly.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Community-driven',
    text: 'The more buyers share, the better the data. Your review helps the next person make the right call.',
  },
]

export default function AboutPage() {
  return (
    <Container className="py-4" style={{ maxWidth: '860px' }}>
      <h1 className="mb-3">About Best Cars</h1>
      <p className="lead text-muted">
        Best Cars is a community of car buyers helping each other find dealerships that
        deserve their business.
      </p>
      <p>
        Buying a car is one of the biggest purchases most people make — yet dealership
        experiences vary wildly. Best Cars collects honest reviews from real buyers,
        runs every review through an automated sentiment analysis, and surfaces the
        signal so you can shop with confidence.
      </p>

      <Row className="g-4 mt-2">
        {VALUES.map((value) => (
          <Col md={4} key={value.title}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <i className={`bi ${value.icon} display-6 text-primary`} aria-hidden="true" />
                <h5 className="card-title mt-3">{value.title}</h5>
                <p className="card-text text-muted mb-0">{value.text}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
