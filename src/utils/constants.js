// src/constants/app.js
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'MaterialFlow Pro'

export const STATUS_COLORS = {
  pending: {
    background: '#fff3cd',
    color: '#856404'
  },
  approved: {
    background: '#d1edff',
    color: '#0c63e4'
  },
  completed: {
    background: '#d1fae5',
    color: '#065f46'
  }
}

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'requests', label: 'Requests', icon: 'file-alt', path: '/requests' },
  { id: 'create', label: 'Create', icon: 'plus-circle', path: '/create' },
  { id: 'reports', label: 'Reports', icon: 'chart-bar', path: '/reports' },
  { id: 'profile', label: 'Profile', icon: 'user', path: '/profile' }
]