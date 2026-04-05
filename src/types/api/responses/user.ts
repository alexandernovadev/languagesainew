/**
 * User Response Types
 */

export interface UserResponse {
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

export interface UsersResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
