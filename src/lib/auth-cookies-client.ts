'use client'

import { AUTH_TOKEN_COOKIE, IS_ADMIN_COOKIE } from '@/lib/auth-cookie-names'

const MAX_AGE_SEC = 60 * 60 * 24 * 7

function secureAttr() {
  if (typeof window === 'undefined') return ''
  return window.location.protocol === 'https:' ? '; Secure' : ''
}

export function setAuthCookiesClient(token: string, isAdmin: boolean) {
  const secure = secureAttr()
  // Do NOT encodeURIComponent — Next.js middleware reads cookies decoded already
  document.cookie = `${AUTH_TOKEN_COOKIE}=${token}; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax${secure}`
  document.cookie = `${IS_ADMIN_COOKIE}=${isAdmin ? 'true' : 'false'}; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax${secure}`
}

export function clearAuthCookiesClient() {
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0`
  document.cookie = `${IS_ADMIN_COOKIE}=; path=/; max-age=0`
}

/** Mantiene cookies alineadas con Redux (persist + login/logout). */
export function syncAuthCookiesFromState(
  token: string | null,
  isAdmin: boolean,
) {
  if (token) setAuthCookiesClient(token, isAdmin)
  else clearAuthCookiesClient()
}
