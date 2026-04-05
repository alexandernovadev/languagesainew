import { HttpClient } from "./api/HttpClient";
import {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  RefreshTokenRequest,
} from "@/types/api";

/**
 * Authentication Service
 * Handles login, logout, and token refresh
 */
class AuthService extends HttpClient {
  constructor() {
    super();
  }

  /**
   * Login with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.post<any>("/api/auth/login", credentials);
    return response.data || response;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const response = await this.post<any>("/api/auth/refresh", { refreshToken });
    const data = response.data || response;
    
    // Backend devuelve accessToken; mapear para consistencia
    return {
      accessToken: data?.accessToken || data?.token,
      refreshToken: data?.refreshToken,
      user: data?.user,
    };
  }

  /**
   * Logout (client-side only, clears local storage)
   */
  logout(): void {
    localStorage.removeItem("user-storage");
    localStorage.removeItem("refreshToken");
  }
}

export const authService = new AuthService();
