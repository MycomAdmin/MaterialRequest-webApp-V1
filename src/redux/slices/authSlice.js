// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    name: 'Alex',
    email: 'alex@example.com',
    role: 'user'
  },
  isAuthenticated: true,
  token: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    }
  }
})

export const { login, logout, updateUser } = authSlice.actions
export default authSlice.reducer