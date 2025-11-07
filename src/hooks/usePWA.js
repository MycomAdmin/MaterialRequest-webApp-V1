// src/hooks/usePWA.js
import { useState, useEffect } from 'react'

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    // Check if app is running as PWA
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      setIsPWA(isStandalone || window.navigator.standalone)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setCanInstall(false)
      setIsPWA(true)
    }

    checkPWA()

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setCanInstall(false)
        return true
      }
    }
    return false
  }

  return {
    isPWA,
    canInstall,
    installPWA,
    deferredPrompt
  }
}