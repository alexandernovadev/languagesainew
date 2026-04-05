/**
 * Authentication Types
 * Request payloads sent to backend
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
