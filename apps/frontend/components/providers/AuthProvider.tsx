'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import { api } from '@/lib/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initFromCookie, setAuth, logout, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      initFromCookie()

      // Si hay token intenta obtener el perfil
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('av_access_token='))
        ?.split('=')[1]

      if (!token) return

      try {
        const user = await api.get<{
          id: string
          email: string
          name: string
          picture?: string
        }>('/users/me')
        setAuth(user, token)
      } catch {
        // Token inválido o expirado
        logout()
      }
    }

    init()
  }, [])

  return <>{children}</>
}