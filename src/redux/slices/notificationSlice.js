// src/redux/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
    duration: 6000
  },
  reducers: {
    showNotification: (state, action) => {
      state.open = true
      state.message = action.payload.message
      state.severity = action.payload.severity || 'info'
      state.duration = action.payload.duration || 6000
    },
    hideNotification: (state) => {
      state.open = false
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer