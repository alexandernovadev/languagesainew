import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse } from '@/types/api';

interface UserState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: UserResponse | null) => void;
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
