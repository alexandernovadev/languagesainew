import { useUserStore } from "@/lib/store/user-store";
import { authService, LoginCredentials } from "@/services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useAuth() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setUser, setToken, clearSession } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      
      // Store token and user in Zustand store
      setToken(response.token);
      setUser(response.user);
      
      // Store refresh token in localStorage
      localStorage.setItem("refreshToken", response.refreshToken);
      
      toast.success("Login exitoso");
      navigate("/");
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    clearSession();
    localStorage.removeItem("refreshToken");
    toast.info("Sesión cerrada");
    navigate("/login");
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return false;
      }

      const response = await authService.refreshToken(refreshToken);
      setToken(response.token);
      setUser(response.user);
      
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearSession();
      localStorage.removeItem("refreshToken");
      return false;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAccessToken,
  };
}
