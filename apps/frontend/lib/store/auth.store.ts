import { create } from 'zustand'
import { api } from '../api'

interface User {
  id: string
  email: string
  name: string
  picture?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    api.setToken(token)
    set({ user, accessToken: token, isAuthenticated: true })
  },

  logout: () => {
    api.setToken(null)
    set({ user: null, accessToken: null, isAuthenticated: false })
  },
}))