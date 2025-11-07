// src/services/mockApi.js
// Mock data and functions to simulate API calls

const mockMaterials = [
  {
    id: 1,
    name: 'Electrical Wire 2.5mm',
    code: 'MAT-ELEC-001',
    category: 'Electrical',
    stock: 250,
    unit: 'm',
    minStock: 50
  },
  {
    id: 2,
    name: 'PVC Pipe 1-inch',
    code: 'MAT-PIPE-015',
    category: 'Plumbing',
    stock: 45,
    unit: 'units',
    minStock: 10
  },
  {
    id: 3,
    name: 'Hammer Drill',
    code: 'MAT-TOOL-203',
    category: 'Tools',
    stock: 8,
    unit: 'units',
    minStock: 2
  },
  {
    id: 4,
    name: 'Safety Helmet',
    code: 'MAT-SAFE-042',
    category: 'Safety',
    stock: 32,
    unit: 'units',
    minStock: 5
  },
  {
    id: 5,
    name: 'Concrete Mix',
    code: 'MAT-CONC-108',
    category: 'Construction',
    stock: 15,
    unit: 'bags',
    minStock: 5
  }
]

const mockRequests = [
  {
    id: 'TR-2023-00125',
    title: 'Electrical Components',
    status: 'pending',
    date: '2023-11-15',
    items: 5,
    location: 'Main Warehouse',
    requestedDate: '2023-11-18'
  },
  {
    id: 'TR-2023-00124',
    title: 'Construction Materials',
    status: 'approved',
    date: '2023-11-14',
    items: 8,
    location: 'Construction Site A',
    requestedDate: '2023-11-17'
  },
  {
    id: 'TR-2023-00123',
    title: 'Tools & Equipment',
    status: 'completed',
    date: '2023-11-13',
    items: 3,
    location: 'Tool Room',
    requestedDate: '2023-11-16'
  }
]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAPI = {
  // Materials
  getMaterials: async (search = '') => {
    await delay(500)
    if (search) {
      return mockMaterials.filter(material =>
        material.name.toLowerCase().includes(search.toLowerCase()) ||
        material.code.toLowerCase().includes(search.toLowerCase())
      )
    }
    return mockMaterials
  },

  getMaterial: async (id) => {
    await delay(300)
    return mockMaterials.find(material => material.id === parseInt(id))
  },

  // Requests
  getRequests: async () => {
    await delay(600)
    return mockRequests
  },

  createRequest: async (requestData) => {
    await delay(800)
    const newRequest = {
      id: `TR-2023-${String(mockRequests.length + 1).padStart(5, '0')}`,
      ...requestData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    mockRequests.unshift(newRequest)
    return newRequest
  },

  updateRequest: async (id, updates) => {
    await delay(500)
    const index = mockRequests.findIndex(req => req.id === id)
    if (index !== -1) {
      mockRequests[index] = { ...mockRequests[index], ...updates }
      return mockRequests[index]
    }
    throw new Error('Request not found')
  },

  // Analytics
  getStats: async () => {
    await delay(400)
    return {
      pending: mockRequests.filter(req => req.status === 'pending').length,
      approved: mockRequests.filter(req => req.status === 'approved').length,
      completed: mockRequests.filter(req => req.status === 'completed').length,
      total: mockRequests.length
    }
  }
}