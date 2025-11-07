// src/components/common/PWAInstallPrompt.jsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import {
  Close as CloseIcon,
  InstallDesktop as InstallIcon
} from '@mui/icons-material'
import { GradientButton } from '../ui/StyledComponents'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isAlreadyInstalled = isStandalone || window.navigator.standalone
    
    if (isAlreadyInstalled) {
      console.log('App is already installed')
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    // Check if we already have a deferred prompt (page reload)
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Store for page reloads
    window.deferredPrompt = deferredPrompt

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [deferredPrompt])

  const handleInstall = async () => {
    console.log('Install button clicked')
    
    if (deferredPrompt) {
      console.log('Prompting installation...')
      deferredPrompt.prompt()
      
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response: ${outcome}`)
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setShowPrompt(false)
        setDeferredPrompt(null)
        window.deferredPrompt = null
      }
    } else {
      console.log('No deferred prompt available')
    }
  }

  const handleClose = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwaPromptDismissed', 'true')
  }

  // Don't show if user dismissed in this session
  if (sessionStorage.getItem('pwaPromptDismissed') === 'true') {
    return null
  }

  return (
    <Dialog
      open={showPrompt}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="600">
            Install MaterialFlow Pro
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box textAlign="center" py={2}>
          <InstallIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Install App
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Install MaterialFlow Pro for quick access and better experience.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          sx={{ flex: 1 }}
        >
          Not Now
        </Button>
        <GradientButton
          onClick={handleInstall}
          startIcon={<InstallIcon />}
          sx={{ flex: 1 }}
        >
          Install
        </GradientButton>
      </DialogActions>
    </Dialog>
  )
}

export default PWAInstallPrompt