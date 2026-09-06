export const isTauri = () =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

export async function startGoogleOAuth(): Promise<string> {
  if (!isTauri()) {
    throw new Error('OAuth solo disponible en la app de escritorio')
  }
  const { invoke } = await import('@tauri-apps/api/core')
  const code = await invoke<string>('start_oauth')
  return code
}

export async function saveTokenSecure(key: string, value: string): Promise<void> {
  sessionStorage.setItem(key, value)
}

export async function getTokenSecure(key: string): Promise<string | null> {
  return sessionStorage.getItem(key)
}

export async function removeTokenSecure(key: string): Promise<void> {
  sessionStorage.removeItem(key)
}