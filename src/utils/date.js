// src/utils/date.js
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  return new Date(dateString).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options
  })
}

export const getToday = () => {
  return new Date().toISOString().split('T')[0]
}

export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString().split('T')[0]
}

export const isFutureDate = (dateString) => {
  return new Date(dateString) > new Date()
}