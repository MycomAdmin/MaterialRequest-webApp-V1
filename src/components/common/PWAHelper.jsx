// src/components/common/PWAHelper.jsx
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Android as AndroidIcon,
  Apple as AppleIcon,
  Download as DownloadIcon
} from '@mui/icons-material'

const PWAHelper = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  if (isStandalone) {
    return null
  }

  return (
    <Card sx={{ m: 2, maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Install MaterialFlow Pro
        </Typography>
        
        {isIOS ? (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              To install this app on your iOS device:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary="Tap the share button" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AppleIcon />
                </ListItemIcon>
                <ListItemText primary="Select 'Add to Home Screen'" />
              </ListItem>
            </List>
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              To install this app on your device:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText primary="Look for the install button in your browser" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AndroidIcon />
                </ListItemIcon>
                <ListItemText primary="Or use the browser menu to install" />
              </ListItem>
            </List>
          </>
        )}
        
        <Box mt={2}>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PWAHelper