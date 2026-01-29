import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
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
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearSession: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ 
        token, 
        isAuthenticated: !!token 
      }),

      clearSession: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
