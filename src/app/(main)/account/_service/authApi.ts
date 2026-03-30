// store/api/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../../service/baseQuery'
import type{ User } from '../_slice/authSlice';

interface AuthResponse {
  success: boolean;
  token: string;
  user: User
}

interface RegisterResponse {
  success: boolean
  message: string
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ["User"],
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ["User"]
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload
      })
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    })
  })
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi