// src/components/common/Notification.jsx
import React from 'react'
import { 
  Snackbar, 
  Alert 
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { hideNotification } from '../../redux/slices/notificationSlice'

const Notification = () => {
  const dispatch = useDispatch()
  const { open, message, severity, duration } = useSelector(
    state => state.notification
  )

  const handleClose = () => {
    dispatch(hideNotification())
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification