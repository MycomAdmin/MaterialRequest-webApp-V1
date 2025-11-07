// src/redux/slices/requestsSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  requests: [
    {
      id: 'TR-2023-00125',
      title: 'Electrical Components',
      status: 'pending',
      date: '2023-11-15',
      items: 5,
      location: 'Main Warehouse'
    },
    {
      id: 'TR-2023-00124',
      title: 'Construction Materials',
      status: 'approved',
      date: '2023-11-14',
      items: 8,
      location: 'Construction Site A'
    },
    {
      id: 'TR-2023-00123',
      title: 'Tools & Equipment',
      status: 'completed',
      date: '2023-11-13',
      items: 3,
      location: 'Tool Room'
    }
  ],
  stats: {
    pending: 12,
    approved: 24,
    completed: 38
  },
  currentRequest: null
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload
    },
    addRequest: (state, action) => {
      state.requests.unshift(action.payload)
    },
    updateRequest: (state, action) => {
      const index = state.requests.findIndex(req => req.id === action.payload.id)
      if (index !== -1) {
        state.requests[index] = action.payload
      }
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload
    }
  }
})

export const { 
  setRequests, 
  addRequest, 
  updateRequest, 
  setStats, 
  setCurrentRequest 
} = requestsSlice.actions

export default requestsSlice.reducer