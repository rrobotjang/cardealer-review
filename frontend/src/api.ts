import type {
  CarMake,
  Dealership,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  Review,
  ReviewPayload,
} from './types'

const TOKEN_KEY = 'jwt'
const USERNAME_KEY = 'username'

const API_BASE = import.meta.env.VITE_API_URL || ''

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function getUsername(): string | null {
  return sessionStorage.getItem(USERNAME_KEY)
}

export function setSession(token: string, username: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USERNAME_KEY, username)
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USERNAME_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${response.status})`
    throw new ApiError(response.status, message)
  }
  return data as T
}

export const api = {
  dealerships: () => request<Dealership[]>('/api/dealerships'),
  dealership: (id: number) => request<Dealership>(`/api/dealerships/${id}/`),
  dealerReviews: (id: number) => request<{ reviews: Review[] }>(`/api/dealer/${id}/reviews`),
  carMakes: () => request<CarMake[]>('/api/carmakes'),
  login: (username: string, password: string) =>
    request<LoginResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (payload: RegisterPayload) =>
    request<RegisterResponse>('/api/register', { method: 'POST', body: JSON.stringify(payload) }),
  addReview: (id: number, payload: ReviewPayload) =>
    request<Review>(`/api/dealer/${id}/review`, { method: 'POST', body: JSON.stringify(payload) }),
}
