// Detecta si la app corre dentro de Tauri
export const isTauri = () =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

// Inicia el flujo de Google OAuth via Tauri
export async function startGoogleOAuth(): Promise<string> {
  if (!isTauri()) {
    // En browser de desarrollo — redirige directamente
    throw new Error('OAuth solo disponible en la app de escritorio')
  }

  const { invoke } = await import('@tauri-apps/api/core')
  const code = await invoke<string>('start_oauth')
  return code
}

// Guarda el token en el keychain nativo del SO via Tauri
export async function saveTokenSecure(key: string, value: string): Promise<void> {
  if (!isTauri()) {
    // En desarrollo — usa sessionStorage como fallback
    sessionStorage.setItem(key, value)
    return
  }
  // En producción Tauri usaría tauri-plugin-stronghold o keychain
  // Por ahora guardamos en memoria
  sessionStorage.setItem(key, value)
}

export async function getTokenSecure(key: string): Promise<string | null> {
  return sessionStorage.getItem(key)
}

export async function removeTokenSecure(key: string): Promise<void> {
  sessionStorage.removeItem(key)
}