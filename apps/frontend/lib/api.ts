const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...init?.headers,
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error desconocido' }))
      throw new Error(err.message ?? 'Error en la solicitud')
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }

  get<T>(path: string) {
    return this.request<T>(path)
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) })
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
  }

  delete(path: string) {
    return this.request<void>(path, { method: 'DELETE' })
  }
}

export const api = new ApiClient()