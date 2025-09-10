import { useEffect } from "react";
import { useUserStore } from "@/lib/store/user-store";

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    validateToken,
    clearSession,
    openLoginModal,
  } = useUserStore();

  // Validación proactiva del token al montar el componente
  useEffect(() => {
    if (token) {
      const isValid = validateToken();
      if (!isValid) {
        console.log("🔒 Token inválido detectado en useAuth");
        // La validación ya limpia la sesión automáticamente
        // Si el refresh falla, se abrirá el modal automáticamente desde el interceptor
      }
    }
  }, [token, validateToken]);

  // Log del estado actual
  useEffect(() => {
    console.log("🔍 Auth state check:", {
      user: user?._id,
      token: token ? "present" : "missing",
      isAuthenticated: isAuthenticated(),
    });
  }, [user, token, isAuthenticated]);

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    validateToken,
    clearSession,
    openLoginModal,
  };
};
