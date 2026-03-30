'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { syncAuthCookiesFromState } from '@/lib/auth-cookies-client'

/** Sincroniza token/rol admin a cookies para que el middleware pueda proteger /admin. */
export function AuthCookieSync() {
  const token = useAppSelector((s) => s.auth.token)
  const isAdmin = useAppSelector((s) => s.auth.user?.isAdmin ?? false)

  useEffect(() => {
    syncAuthCookiesFromState(token, isAdmin)
  }, [token, isAdmin])

  return null
}
