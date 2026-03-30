import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store/index'

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const baseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    
    headers.set('ngrok-skip-browser-warning', 'true')
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

