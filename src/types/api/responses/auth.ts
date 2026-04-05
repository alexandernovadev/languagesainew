/**
 * Auth Response Types
 * Responses received from backend
 */

export interface UserData {
  _id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  language?: string;
  explainsLanguage?: string;
  isActive: boolean;
  address?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserData;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  user?: UserData;
}
