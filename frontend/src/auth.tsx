import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, clearSession, getToken, getUsername, setSession } from './api'
import type { RegisterPayload } from './types'

interface AuthContextValue {
  username: string | null
  token: string | null
  modalOpen: boolean
  openLogin: () => void
  closeLogin: () => void
  login: (username: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => getUsername())
  const [token, setToken] = useState<string | null>(() => getToken())
  const [modalOpen, setModalOpen] = useState(false)

  const openLogin = useCallback(() => setModalOpen(true), [])
  const closeLogin = useCallback(() => setModalOpen(false), [])

  const login = useCallback(async (username: string, password: string) => {
    const data = await api.login(username, password)
    setSession(data.access, username)
    setToken(data.access)
    setUsername(username)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await api.register(payload)
    setSession(data.tokens.access, data.username)
    setToken(data.tokens.access)
    setUsername(data.username)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUsername(null)
  }, [])

  const value = useMemo(
    () => ({ username, token, modalOpen, openLogin, closeLogin, login, register, logout }),
    [username, token, modalOpen, openLogin, closeLogin, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
