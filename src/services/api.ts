import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_BACK_URL,
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Interceptor de Request - Agregar headers automáticamente
api.interceptors.request.use(
  (config) => {
    // Log de requests (solo en desarrollo)
    if (import.meta.env.DEV) {
      console.log(`🌐 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
    }

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('user-storage') 
      ? JSON.parse(localStorage.getItem('user-storage') || '{}')?.state?.token 
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
      console.log(`✅ [RESPONSE] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
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
      
      switch (status) {
        case 401:
          // No autorizado - limpiar token y redirigir a login
          console.log("🔒 Acceso no autorizado");
          localStorage.removeItem('user-storage');
          // window.location.href = '/';
          break;
          
        case 403:
          // Prohibido - mostrar mensaje de permisos
          console.error("🔒 Acceso prohibido");
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
      const errorMessage = data?.error || data?.message || `Error ${status}: ${error.response.statusText}`;
      const enhancedError = new Error(errorMessage);
      
      // Agregar información adicional al error
      (enhancedError as any).status = status;
      (enhancedError as any).response = error.response;
      (enhancedError as any).isAxiosError = true;
      
      return Promise.reject(enhancedError);
      
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      console.error("🌐 [NETWORK ERROR] No se pudo conectar al servidor");
      const networkError = new Error("Error de conexión: No se pudo conectar al servidor");
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
      
    } else {
      // Error en la configuración de la petición
      console.error("⚙️ [CONFIG ERROR]", error.message);
      return Promise.reject(error);
    }
  }
);

// Agrego declaración global para Vite env
interface ImportMetaEnv {
  readonly VITE_BACK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
