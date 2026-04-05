import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { useUserStore } from "@/lib/store/user-store";
import { isAbortError } from "@/utils/common/isAbortError";

// ─────────────────────────────────────────────
// Error class
// ─────────────────────────────────────────────

export class HttpError extends Error {
  /** HTTP status code (0 = network error) */
  public status: number;
  /** Preserved for backwards-compat with err.response?.data?.message checks */
  public response?: AxiosResponse;

  constructor(
    public statusCode: number,
    public message: string,
    public data?: any,
    response?: AxiosResponse
  ) {
    super(message);
    this.name = "HttpError";
    this.status = statusCode;
    this.response = response;
  }
}

// ─────────────────────────────────────────────
// Module-level refresh state
// Shared across ALL HttpClient instances so concurrent
// requests from different services don't double-refresh.
// ─────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(baseURL: string): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(
      `${baseURL}/api/auth/refresh`,
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

function handleTokenRefresh(baseURL: string): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = tryRefreshToken(baseURL).finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

function clearSession(): void {
  const store = useUserStore.getState();
  store.clearSession();
  localStorage.removeItem("refreshToken");
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

function buildError(status: number, data: any, response: AxiosResponse): HttpError {
  const message =
    data?.error ||
    data?.message ||
    `Error ${status}: ${response.statusText}`;
  return new HttpError(status, message, data, response);
}

// ─────────────────────────────────────────────
// Base HTTP client
// ─────────────────────────────────────────────

export abstract class HttpClient {
  protected client: AxiosInstance;
  protected baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_BACK_URL || "http://localhost:3000") {
    this.baseURL = baseURL;
    this.client = axios.create({ baseURL, withCredentials: true });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // ── Request ──────────────────────────────
    this.client.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log(`🌐 [${config.method?.toUpperCase()}] ${config.url}`, {
            params: config.params,
            data: config.data,
          });
        }

        // Token from Zustand store — never from raw localStorage
        const token = useUserStore.getState().token;
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

    // ── Response ─────────────────────────────
    this.client.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`✅ [${response.status}] ${response.config.url}`, {
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        // Silently pass through cancelled requests
        if (isAbortError(error)) return Promise.reject(error);

        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (import.meta.env.DEV) {
          console.error(`💥 [${error.response?.status ?? "ERROR"}] ${originalRequest?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        }

        // ── Server responded (4xx, 5xx) ──────
        if (error.response) {
          const { status, data } = error.response;
          const isRefreshRequest = originalRequest?.url?.includes("auth/refresh");

          // 401 / 403 — attempt token refresh (once)
          if ((status === 401 || status === 403) && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;
            const newToken = await handleTokenRefresh(this.baseURL);

            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }

            clearSession();
            return Promise.reject(buildError(status, data, error.response));
          }

          // Refresh request itself failed — end session
          if ((status === 401 || status === 403) && isRefreshRequest) {
            clearSession();
          }

          return Promise.reject(buildError(status, data, error.response));
        }

        // ── No response — network error ───────
        if (error.request) {
          console.error("🌐 [NETWORK ERROR] No se pudo conectar al servidor");
          const networkError = new HttpError(
            0,
            "Error de conexión: No se pudo conectar al servidor"
          );
          (networkError as any).isNetworkError = true;
          return Promise.reject(networkError);
        }

        // ── Request config error ──────────────
        console.error("⚙️ [CONFIG ERROR]", error.message);
        return Promise.reject(error);
      }
    );
  }

  // ── CRUD methods ─────────────────────────────
  // These unwrap response.data for class-extending services.
  // Services using api = httpClient.getClient() receive
  // the full AxiosResponse (axios default behaviour).

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /** Expose the raw axios instance for services that need AxiosResponse directly */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// ─────────────────────────────────────────────
// Singleton — used by api.ts re-export
// ─────────────────────────────────────────────

export const httpClient = new (class extends HttpClient {})();

/**
 * Raw axios instance backed by the unified HttpClient interceptors.
 * Use this in services that need the full AxiosResponse (headers, status, etc.).
 * Prefer extending HttpClient directly for new services.
 */
export const axiosClient = httpClient.getClient();
