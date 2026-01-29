import { api } from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    language?: string;
    isActive: boolean;
    address?: string;
    phone?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface RefreshTokenResponse {
  token: string;
  user: LoginResponse["user"];
}

class AuthService {
  /**
   * Login with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post("/api/auth/login", credentials);
    return response.data.data;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post("/api/auth/refresh", { refreshToken });
    return response.data.data;
  }

  /**
   * Logout (client-side only, clears local storage)
   */
  logout(): void {
    localStorage.removeItem("user-storage");
  }
}

export const authService = new AuthService();
