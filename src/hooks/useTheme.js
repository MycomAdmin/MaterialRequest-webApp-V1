// src/hooks/useTheme.js
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme, setTheme } from '../redux/slices/themeSlice'

export const useTheme = () => {
  const dispatch = useDispatch()
  const themeState = useSelector(state => state.theme)

  const toggle = () => {
    dispatch(toggleTheme())
  }

  const set = (mode) => {
    dispatch(setTheme(mode))
  }

  return {
    theme: themeState.theme,
    mode: themeState.mode,
    toggleTheme: toggle,
    setTheme: set
  }
}