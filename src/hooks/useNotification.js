// src/hooks/useNotification.js
import { useDispatch } from 'react-redux'
import { showNotification, hideNotification } from '../redux/slices/notificationSlice'

export const useNotification = () => {
  const dispatch = useDispatch()

  const show = (message, severity = 'info', duration = 6000) => {
    dispatch(showNotification({ message, severity, duration }))
  }

  const hide = () => {
    dispatch(hideNotification())
  }

  return { show, hide }
}