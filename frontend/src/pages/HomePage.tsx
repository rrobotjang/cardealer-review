import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'

const FEATURES = [
  {
    icon: 'bi-shop',
    title: 'Browse dealerships',
    text: 'Explore dealerships across the country with location, contact details and ratings at a glance.',
  },
  {
    icon: 'bi-chat-square-text',
    title: 'Real buyer reviews',
    text: 'Read first-hand experiences from verified buyers about price, service and the buying process.',
  },
  {
    icon: 'bi-stars',
    title: 'Sentiment insights',
    text: 'Every review is analyzed automatically so you can spot the truly great dealerships in seconds.',
  },
]

const STEPS = [
  { title: '1. Browse', text: 'Search the dealership directory for a dealer near you.' },
  { title: '2. Read', text: 'Check reviews and sentiment scores from other buyers.' },
  { title: '3. Share', text: 'Create an account and tell others about your own experience.' },
]

export default function HomePage() {
  const { username, openLogin } = useAuth()

  return (
    <div>
      <section className="hero-bestcars py-5">
        <Container>
          <Row className="align-items-center g-4 py-3">
            <Col lg={7}>
              <h1 className="display-4 mb-3">Find your next car with confidence</h1>
              <p className="lead mb-4 opacity-75">
                Read honest reviews from real buyers, compare dealerships across the
                country, and share your own experience.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/dealers" className="btn btn-light btn-lg">
                  Browse dealerships
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg">
                  Learn more
                </Link>
              </div>
            </Col>
            <Col lg={5} className="text-center">
              <i
                className="bi bi-car-front-fill display-1 opacity-50"
                aria-hidden="true"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <h2 className="text-center mb-4">Why Best Cars?</h2>
        <Row className="g-4">
          {FEATURES.map((feature) => (
            <Col md={4} key={feature.title}>
              <div className="card h-100 border-0 shadow-sm card-lift">
                <div className="card-body text-center p-4">
                  <i
                    className={`bi ${feature.icon} display-6 text-primary`}
                    aria-hidden="true"
                  />
                  <h5 className="card-title mt-3">{feature.title}</h5>
                  <p className="card-text text-muted mb-0">{feature.text}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="mt-5 g-4">
          <Col lg={7}>
            <h2 className="mb-4">How it works</h2>
            <Row className="g-3">
              {STEPS.map((step) => (
                <Col md={4} key={step.title}>
                  <div className="card h-100 border-0 bg-white">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{step.title}</h5>
                      <p className="card-text text-muted mb-0">{step.text}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={5}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4 d-flex flex-column justify-content-center">
                <i className="bi bi-pencil-square display-6 text-primary" aria-hidden="true" />
                <h5 className="card-title mt-3">
                  {username ? 'Share your experience' : 'Bought a car recently?'}
                </h5>
                <p className="card-text text-muted">
                  {username
                    ? 'Pick a dealership and leave a review — it takes less than a minute.'
                    : 'Log in to write a review and help other buyers make the right choice.'}
                </p>
                {username ? (
                  <Link to="/dealers" className="btn btn-primary">
                    Go to dealerships
                  </Link>
                ) : (
                  <Button variant="primary" onClick={openLogin}>
                    Log in to write a review
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
