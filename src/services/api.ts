import { useUserStore } from "@/lib/store/user-store";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL,
  withCredentials: true,
});

// Token refresh: evitar múltiples refreshes concurrentes
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_URL}/api/auth/refresh`,
      { refreshToken },
      { withCredentials: true }
    );
    const data = response.data?.data || response.data;
    const newToken = data?.accessToken || data?.token;
    const newRefreshToken = data?.refreshToken;
    const user = data?.user;

    if (!newToken) return null;

    const store = useUserStore.getState();
    store.setToken(newToken);
    if (user) store.setUser(user);
    if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

    return newToken;
  } catch {
    return null;
  }
}

async function handleTokenRefresh(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = tryRefreshToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

// Interceptor de Request - Agregar headers automáticamente
api.interceptors.request.use(
  (config) => {
    // Log de requests (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.log(
        `🌐 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
          headers: config.headers,
        }
      );
    }

    // Agregar token de autenticación si existe
    const token = localStorage.getItem("user-storage")
      ? JSON.parse(localStorage.getItem("user-storage") || "{}")?.state?.token
      : null;

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ [REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejar errores HTTP globalmente
api.interceptors.response.use(
  (response) => {
    // Log de responses exitosas (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.log(
        `✅ [RESPONSE] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  async (error) => {
    // Log detallado del error
    console.error("💥 [RESPONSE ERROR]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Manejar diferentes tipos de errores
    if (error.response) {
      // Error de respuesta del servidor (4xx, 5xx)
      const { status, data } = error.response;
      const isRefreshRequest = error.config?.url?.includes?.("auth/refresh");

      // 401/403: token expirado o inválido - intentar refresh
      if ((status === 401 || status === 403) && !isRefreshRequest) {
        const newToken = await handleTokenRefresh();

        if (newToken && error.config) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
        }

        // Refresh falló: limpiar sesión y redirigir
        const store = useUserStore.getState();
        store.clearSession();
        localStorage.removeItem("refreshToken");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      // Si fue la petición de refresh la que falló
      if ((status === 401 || status === 403) && isRefreshRequest) {
        const store = useUserStore.getState();
        store.clearSession();
        localStorage.removeItem("refreshToken");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      switch (status) {
        case 401:
        case 403:
          // Ya manejados arriba; por si acaso
          break;

        case 404:
          // No encontrado
          console.error("🔍 Recurso no encontrado");
          break;

        case 500:
          // Error interno del servidor
          console.error("💻 Error interno del servidor");
          break;

        default:
          // Otros errores HTTP
          console.error(`❌ Error HTTP ${status}`);
      }

      // Crear un error más descriptivo
      const errorMessage =
        data?.error ||
        data?.message ||
        `Error ${status}: ${error.response.statusText}`;
      const enhancedError = new Error(errorMessage);

      // Agregar información adicional al error
      (enhancedError as any).status = status;
      (enhancedError as any).response = error.response;
      (enhancedError as any).isAxiosError = true;

      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      console.error("🌐 [NETWORK ERROR] No se pudo conectar al servidor");
      const networkError = new Error(
        "Error de conexión: No se pudo conectar al servidor"
      );
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    } else {
      // Error en la configuración de la petición
      console.error("⚙️ [CONFIG ERROR]", error.message);
      return Promise.reject(error);
    }
  }
);
