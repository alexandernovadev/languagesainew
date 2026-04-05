/**
 * User Request Types
 */

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  language?: string;
  explainsLanguage?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  language?: string;
  explainsLanguage?: string;
  address?: string;
  phone?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
