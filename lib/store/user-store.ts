import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "@/services/authService"
import type { User } from "@/models/User"

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      login: async (username, password) => {
        set({ loading: true, error: null })
        try {
          const data = await authService.login(username, password)
          set({ user: data.user, loading: false })
          localStorage.setItem("token", data.token)
        } catch (error: any) {
          set({ error: error.message || "Error de login", loading: false })
        }
      },
      logout: () => {
        set({ user: null })
        localStorage.removeItem("token")
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
) 