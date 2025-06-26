import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import type { User } from "@/models/User";

// Función para normalizar la estructura del usuario
const normalizeUser = (userData: any): User => {
  return {
    _id: userData._id || userData.id,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    isActive: userData.isActive,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
};

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  isAuthenticated: () => boolean;
  checkAndCleanState: () => void;
  reloadFromStorage: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authService.login(username, password);
          const normalizedUser = normalizeUser(data.user);
          set({ user: normalizedUser, token: data.token, loading: false });
        } catch (error: any) {
          set({ error: error.message || "Error de login", loading: false });
        }
      },
      logout: () => {
        set({ user: null, token: null, error: null });
      },
      setUser: (user) => set({ user: user ? normalizeUser(user) : null }),
      setToken: (token) => set({ token }),
      isAuthenticated: () => {
        const state = get();
        return !!(state.token && state.user);
      },
      checkAndCleanState: () => {
        const state = get();
        if (!state.user && state.token) {
          set({ user: null, token: null });
        }
      },
      reloadFromStorage: () => {
        const state = get();
        if (state.user) {
          set({ user: normalizeUser(state.user) });
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
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
