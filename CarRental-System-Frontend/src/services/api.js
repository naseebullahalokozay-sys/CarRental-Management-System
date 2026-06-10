import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  
  getCsrfToken: () => api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000'}),
  register: (data) => api.post('/admin/register', data),
  login: (data) => api.post('/admin/login', data),
  logout: () => api.post('/admin/logout'),
  getCurrentUser: () => api.get('/admin/me'),
}

// Car Owners API
export const ownerApi = {
  getAll: () => api.get('/car-owners'),
  getById: (id) => api.get(`/car-owners/${id}`),
  create: (data) => api.post('/car-owners', data),
  update: (id, data) => api.put(`/car-owners/${id}`, data),
  delete: (id) => api.delete(`/car-owners/${id}`),
}

// Cars API
export const carApi = {
  getAll: () => api.get('/cars'),
  getById: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
}

// Statuses API
export const statusApi = {
  getAll: () => api.get('/car-statuses')
}

// Customers API
export const customerApi= {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.post(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
}

// Bookings API
export const bookingApi = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
}

// Rentals API
export const rentalApi = {
  getAll: () => api.get('/rentals'),
  getById: (id) => api.get(`/rentals/${id}`),
  create: (data) => api.post('/rentals', data),
  end: (id, data) => api.patch(`/rentals/${id}/end`, data),
  // start: (id) => api.patch(`/rentals/${id}/start`),
}

// Payments API
export const paymentApi = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
}

// Guarantees API
export const guaranteeApi = {
  getAll: () => api.get('/guarantees'),
  getById: (id) => api.get(`/guarantees/${id}`),
  create: (data) => api.post('/guarantees', data),
  update: (id, data) => api.post(`/guarantees/${id}?_method=PUT`, data),
  // updateStatus: (id, status) => api.patch(`/guarantees/${id}/status`, { status }),
}

// Owner Payments API
export const ownerPaymentApi = {
  getAll: () => api.get('/owner-payments'),
  getById: (id) => api.get(`/owner-payments/${id}`),
  create: (data) => api.post('/owner-payments', data),
}

// Dashboard API
export const dashboardApi = {
  getStats:          () => api.get('/dashboard/stats'),
  getRecentBookings: () => api.get('/dashboard/recent-bookings'),
  getRecentPayments: () => api.get('/dashboard/recent-payments'),
}

export default api
