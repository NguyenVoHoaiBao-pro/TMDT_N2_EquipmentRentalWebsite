import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/api/auth/login', { email, password }),
    register: (email: string, password: string, username: string) =>
      apiClient.post('/api/auth/register', { email, password, username }),
    logout: () => apiClient.post('/api/auth/logout'),
  },

  // Equipment endpoints
  equipment: {
    list: (params?: Record<string, unknown>) => apiClient.get('/api/equipment', { params }),
    getById: (id: string) => apiClient.get(`/api/equipment/${id}`),
    search: (keyword: string) => apiClient.get('/api/equipment/search', { params: { keyword } }),
  },

  // Order endpoints
  orders: {
    list: () => apiClient.get('/api/orders'),
    create: (orderData: Record<string, unknown>) => apiClient.post('/api/orders', orderData),
    getById: (id: string) => apiClient.get(`/api/orders/${id}`),
  },

  // User endpoints
  user: {
    profile: () => apiClient.get('/api/user/profile'),
    updateProfile: (data: Record<string, unknown>) => apiClient.put('/api/user/profile', data),
  },
};

export default apiClient;
