import type { ReactNode } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthModal from './AuthModal'

export default function Layout({ children }: { children: ReactNode }) {
  const { username, openLogin, logout } = useAuth()

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar expand="lg" className="navbar-bestcars sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-car-front-fill text-primary" aria-hidden="true" />
            Best Cars
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/dealers" end>
                Dealers
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact">
                Contact
              </Nav.Link>
            </Nav>
            <Nav>
              {username ? (
                <>
                  <Navbar.Text className="me-2">
                    <i className="bi bi-person-circle me-1" aria-hidden="true" />
                    <span className="fw-semibold">{username}</span>
                  </Navbar.Text>
                  <Button variant="outline-primary" size="sm" onClick={logout}>
                    Log out
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="sm" onClick={openLogin}>
                  Log in
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">{children}</main>

      <footer className="footer-bestcars mt-5 py-4">
        <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div>
            <i className="bi bi-car-front-fill me-2" aria-hidden="true" />
            Best Cars — dealership reviews you can trust
          </div>
          <div className="d-flex gap-3">
            <Link to="/dealers">Dealers</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </Container>
      </footer>

      <AuthModal />
    </div>
  )
}
