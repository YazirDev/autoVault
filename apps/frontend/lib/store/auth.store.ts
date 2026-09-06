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
  initFromCookie: () => void
}

// Guarda el token en cookie para que el middleware lo pueda leer
function setCookie(name: string, value: string, days = 1) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1] ?? null
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    api.setToken(token)
    setCookie('av_access_token', token)
    set({ user, accessToken: token, isAuthenticated: true })
  },

  logout: () => {
    api.setToken(null)
    deleteCookie('av_access_token')
    set({ user: null, accessToken: null, isAuthenticated: false })
  },

  // Restaura la sesión si hay cookie al cargar la app
  initFromCookie: () => {
    const token = getCookie('av_access_token')
    if (token) {
      api.setToken(token)
      set({ accessToken: token, isAuthenticated: true })
    }
  },
}))