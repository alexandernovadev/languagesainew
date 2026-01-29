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
  language: string;
  isActive: boolean;
}

interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string, refreshToken?: string) => void;
  clearSession: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token, refreshToken) => set({ 
        token, 
        refreshToken: refreshToken || get().refreshToken,
        isAuthenticated: true 
      }),

      clearSession: () => set({ 
        user: null, 
        token: null, 
        refreshToken: null, 
        isAuthenticated: false 
      }),

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          return false;
        }

        try {
          // Aquí iría la llamada al endpoint de refresh token
          // const response = await axios.post('/api/auth/refresh', { refreshToken });
          // const { accessToken } = response.data;
          // set({ token: accessToken });
          // return true;
          
          // Por ahora, retornamos false hasta implementar el endpoint
          console.warn('Refresh token endpoint not implemented yet');
          return false;
        } catch (error) {
          console.error('Error refreshing token:', error);
          get().clearSession();
          return false;
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
