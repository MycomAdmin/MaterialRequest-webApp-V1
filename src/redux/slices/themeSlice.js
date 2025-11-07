// src/redux/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { theme } from '../../theme'

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light',
    theme: theme
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action) => {
      state.mode = action.payload
    }
  }
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer