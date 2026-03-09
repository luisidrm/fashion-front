import { createSlice } from "@reduxjs/toolkit"

export interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  user: {
    name: string
    email: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    country: string
  } | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
