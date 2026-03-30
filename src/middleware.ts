import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_TOKEN_COOKIE, IS_ADMIN_COOKIE } from '@/lib/auth-cookie-names'
import { decodeJwtPayload } from '@/lib/decode-jwt-payload'

function isAdminAccess(request: NextRequest): boolean {
  // Check IS_ADMIN_COOKIE first — simplest path
  const isAdminCookie = request.cookies.get(IS_ADMIN_COOKIE)?.value
  if (isAdminCookie === 'true') return true

  // Fall back to decoding the JWT
  const rawToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value
  if (!rawToken) return false

  // Try both encoded and raw forms
  const attempts = [rawToken]
  try { attempts.push(decodeURIComponent(rawToken)) } catch { /* ignore */ }
  try { attempts.push(encodeURIComponent(rawToken)) } catch { /* ignore */ }

  for (const token of attempts) {
    const payload = decodeJwtPayload(token)
    if (payload?.isAdmin === true) return true
    if (payload?.is_admin === true) return true
    // Also check string 'true' in case the JWT encodes it that way
    if (payload?.isAdmin === 'true') return true
    if (payload?.is_admin === 'true') return true
  }

  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Safety: never redirect if already going to /account to avoid loops
  if (pathname.startsWith('/account')) return NextResponse.next()

  if (!isAdminAccess(request)) {
    const url = request.nextUrl.clone()
    url.pathname = '/account'
    url.searchParams.set('from', 'admin')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}