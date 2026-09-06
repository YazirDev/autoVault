import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login']
const PROTECTED_PREFIX = '/dashboard'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas que no necesitan autenticación
  const isPublic = PUBLIC_ROUTES.includes(pathname)

  // Rutas que sí la necesitan
  const isProtected = pathname.startsWith(PROTECTED_PREFIX)

  if (!isProtected) return NextResponse.next()

  // Busca el token en las cookies
  // El token lo vamos a guardar en cookie httpOnly cuando hagamos login
  const token = request.cookies.get('av_access_token')?.value

  if (!token && isProtected) {
    // Redirige al login guardando la ruta original
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Aplica el middleware a todas las rutas excepto assets estáticos
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)',
  ],
}