// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import themeSlice from './slices/themeSlice'
import notificationSlice from './slices/notificationSlice'
import requestsSlice from './slices/requestsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    notification: notificationSlice,
    requests: requestsSlice,
  },
})

export default store