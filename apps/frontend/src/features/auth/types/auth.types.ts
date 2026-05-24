// Interface for API responses

export interface MyApiResponse<T> {
  statusCode: number;
  appCode?: number;
  message: string;
  result: T;
  timestamp: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  expiresIn: number;
  username: string;
  role: string;
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}
