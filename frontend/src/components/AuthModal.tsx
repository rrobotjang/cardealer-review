import { useState, type FormEvent } from 'react'
import { Alert, Button, Form, Modal, Tab, Tabs } from 'react-bootstrap'
import { ApiError } from '../api'
import { useAuth } from '../auth'
import type { RegisterPayload } from '../types'

export default function AuthModal() {
  const { modalOpen, closeLogin, login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const reset = () => {
    setError(null)
    setUsername('')
    setPassword('')
    setFirstName('')
    setLastName('')
  }

  const handleClose = () => {
    closeLogin()
    reset()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (tab === 'login') {
        await login(username.trim(), password)
      } else {
        const payload: RegisterPayload = {
          username: username.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          password,
        }
        await register(payload)
      }
      handleClose()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal show={modalOpen} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{tab === 'login' ? 'Log in' : 'Create account'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          activeKey={tab}
          onSelect={(key) => {
            if (key) {
              setTab(key)
              setError(null)
            }
          }}
          className="mb-3"
        >
          <Tab eventKey="login" title="Log in" />
          <Tab eventKey="register" title="Register" />
        </Tabs>
        {error && (
          <Alert variant="danger" className="py-2">
            {error}
          </Alert>
        )}
        <Form onSubmit={submit}>
          <Form.Group className="mb-3" controlId="auth-username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </Form.Group>
          {tab === 'register' && (
            <div className="row g-3 mb-0">
              <div className="col">
                <Form.Group controlId="auth-first-name">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="auth-last-name">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            </div>
          )}
          <Form.Group className="mb-4 mt-3" controlId="auth-password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              minLength={8}
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={busy}>
            {busy ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Please wait…
              </>
            ) : tab === 'login' ? (
              'Log in'
            ) : (
              'Create account'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
