import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';
import { User } from '@/services/userService';

// Normalizar usuario para consistencia y valores por defecto
const normalizeUser = (user: any): User => ({
  _id: user._id,
  username: user.username || '',
  email: user.email || '',
  role: user.role || 'student',
  firstName: user.firstName,
  lastName: user.lastName,
  image: user.image,
  language: user.language || 'es',
  isActive: user.isActive ?? true,
  address: user.address,
  phone: user.phone,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  isAuthenticated: () => boolean;
  checkAndCleanState: () => void;
  reloadFromStorage: () => void;
  validateToken: () => boolean;
  clearSession: () => void;
  refreshAccessToken: () => Promise<boolean>;
  openLoginModal: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,
      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authService.login(username, password);
          const normalizedUser = normalizeUser(data.user);
          set({ 
            user: normalizedUser, 
            token: data.token, 
            refreshToken: data.refreshToken,
            loading: false 
          });
        } catch (error: any) {
          set({ error: error.message || "Error de login", loading: false });
        }
      },
      logout: () => {
        set({ user: null, token: null, refreshToken: null, error: null });
      },
      setUser: (user) => set({ user: user ? normalizeUser(user) : null }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      isAuthenticated: () => {
        const state = get();
        return !!(state.token && state.user);
      },
      checkAndCleanState: () => {
        const state = get();
        if (!state.user && state.token) {
          set({ user: null, token: null, refreshToken: null });
        }
      },
      reloadFromStorage: () => {
        const state = get();
        if (state.user) {
          set({ user: normalizeUser(state.user) });
        }
      },
      validateToken: () => {
        const state = get();
        if (!state.token) return false;
        
        try {
          // Decodificar el token JWT para verificar expiración
          const payload = JSON.parse(atob(state.token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < currentTime) {
            console.log("🔒 Token expirado detectado");
            // Intentar refresh antes de limpiar
            get().refreshAccessToken();
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("❌ Error validando token:", error);
          get().clearSession();
          return false;
        }
      },
      clearSession: () => {
        set({ user: null, token: null, refreshToken: null, error: null });
        localStorage.removeItem('user-storage');
      },
      refreshAccessToken: async () => {
        const state = get();
        if (!state.refreshToken) {
          get().clearSession();
          return false;
        }

        try {
          const response = await authService.refresh(state.refreshToken);
          const normalizedUser = normalizeUser(response.data.user);
          set({ 
            user: normalizedUser, 
            token: response.data.accessToken, 
            refreshToken: response.data.refreshToken 
          });
          console.log("🔄 Token refrescado exitosamente");
          return true;
        } catch (error) {
          console.error("❌ Error refrescando token:", error);
          get().clearSession();
          return false;
        }
      },
      openLoginModal: () => {
        // Disparar evento para abrir modal de login
        window.dispatchEvent(new CustomEvent('openLoginModal'));
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        refreshToken: state.refreshToken
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.user) {
          state.user = normalizeUser(state.user);
          console.log("🔄 Rehydrating user store with normalized user:", state.user);
        }
      },
    }
  )
);
