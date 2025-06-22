import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import type { User } from "@/models/User";

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
          set({ user: data.user, token: data.token, loading: false });
        } catch (error: any) {
          set({ error: error.message || "Error de login", loading: false });
        }
      },
      logout: () => {
        set({ user: null, token: null });
      },
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
