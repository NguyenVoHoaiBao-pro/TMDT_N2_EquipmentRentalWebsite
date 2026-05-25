import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
  ForgotPasswordRequest,
  JwtResponse,
  LoginRequest,
  MyApiResponse,
  RegisterRequest,
  TokenRefreshResponse,
  ResetPasswordRequest,
  UserResponse,
} from '@/features/auth/types/auth.types.ts';
import type { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For each request, check if there's a token in local storage and add it to the Authorization header'
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
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
    login: (data: LoginRequest): Promise<JwtResponse> => apiClient.post('/auth/login', data),

    register: (data: RegisterRequest): Promise<UserResponse> =>
      apiClient.post('/auth/register', data),

    forgotPassword: (data: ForgotPasswordRequest): Promise<void> =>
      apiClient.post('/auth/forgot-password', data),

    resetPassword: (data: ResetPasswordRequest): Promise<void> =>
      apiClient.post('/auth/reset-password', data),

    logout: (data: { refreshToken: string | null }): Promise<void> =>
      apiClient.post('/auth/logout', data),

    checkDuplicateEmail: (email: string): Promise<boolean> =>
      apiClient.get('/auth/check-email', {
        params: { email }, // Axios auto convert to /auth/check-email?email=email
      }),

    checkDuplicateUsername: (username: string): Promise<boolean> =>
      apiClient.get('/auth/check-username', {
        params: { username }, // Similar for username
      }),
  },
};

export default apiClient;
