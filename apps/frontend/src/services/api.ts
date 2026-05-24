import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  JwtResponse,
  MyApiResponse,
  TokenRefreshResponse,
} from '@/features/auth/types/auth.types.ts';
import type { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;

apiClient.interceptors.response.use(
  (response) => {
    // unwrap `result` if present
    return response.data && 'result' in response.data ? response.data.result : response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;

    const originalRequest = error.config as CustomAxiosRequestConfig;

    // only handle 401 once per request
    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('refreshToken');

    // no refresh token → force logout
    if (!refreshToken) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // already refreshing → just reject
    if (isRefreshing) {
      return Promise.reject(error);
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post<MyApiResponse<TokenRefreshResponse>>(
        `${API_BASE_URL}/auth/refresh-token`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefresh } = data.result;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefresh);
      isRefreshing = false;

      // retry the original request with a new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

// Define API endpoints
export const api = {
  auth: {
    login: (data: Record<string, string>) => apiClient.post<JwtResponse>('/auth/login', data),

    register: (data: Record<string, string>) => apiClient.post('/auth/register', data),

    forgotPassword: (data: { email: string }) => apiClient.post('/auth/forgot-password', data),

    resetPassword: (data: Record<string, string>) => apiClient.post('/auth/reset-password', data),

    logout: () => apiClient.post('/auth/logout'),
  },
};

export default apiClient;
