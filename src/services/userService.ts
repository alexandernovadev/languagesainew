import { api } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  language: string;
  isActive: boolean;
  address?: string;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  language: string;
  isActive?: boolean;
  address?: string;
  phone?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  language?: string;
  isActive?: boolean;
  address?: string;
  phone?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  username?: string;
  email?: string;
  role?: string | string[];
  language?: string | string[];
  isActive?: string;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  phone?: string;
  address?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  pages: number;
}

export interface UserAuditLog {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN';
  field?: string;
  oldValue?: string;
  newValue?: string;
  performedBy: {
    username: string;
    email: string;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditLogsResponse {
  data: UserAuditLog[];
  total: number;
  page: number;
  pages: number;
}

class UserService {
  // Obtener usuarios con filtros y paginación
  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await api.get(`/api/users?${params.toString()}`);
    return response.data.data;
  }

  // Obtener usuario por ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/api/users/${id}`);
    return response.data.data;
  }

  // Crear usuario
  async createUser(userData: UserCreate): Promise<User> {
    const response = await api.post('/api/users', userData);
    return response.data.data;
  }

  // Actualizar usuario
  async updateUser(id: string, userData: UserUpdate): Promise<User> {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data.data;
  }

  // Eliminar usuario
  async deleteUser(id: string): Promise<User> {
    const response = await api.delete(`/api/users/${id}`);
    return response.data.data;
  }

  // Obtener logs de auditoría de un usuario
  async getUserAuditLogs(userId: string, page: number = 1, limit: number = 20): Promise<AuditLogsResponse> {
    const response = await api.get(`/api/users/${userId}/audit-logs?page=${page}&limit=${limit}`);
    return response.data.data;
  }

  // Obtener logs de auditoría por acción
  async getAuditLogsByAction(action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN', page: number = 1, limit: number = 20): Promise<AuditLogsResponse> {
    const response = await api.get(`/api/users/audit-logs/${action}?page=${page}&limit=${limit}`);
    return response.data.data;
  }
}

export const userService = new UserService(); 