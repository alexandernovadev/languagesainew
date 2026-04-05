import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { useUserStore } from "@/lib/store/user-store";

/**
 * Custom error class for better error handling
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Base HTTP client with:
 * - Centralized error handling
 * - Token refresh logic
 * - Request/response logging
 * - Retry logic (optional)
 * - Request cancellation support
 */
export abstract class HttpClient {
  protected client: AxiosInstance;
  protected baseURL: string;

  // Token refresh state
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseURL: string = import.meta.env.VITE_BACK_URL || "http://localhost:3000") {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Log requests in development
        if (import.meta.env.DEV) {
          console.log(
            `🌐 [${config.method?.toUpperCase()}] ${config.url}`,
            {
              params: config.params,
              data: config.data,
            }
          );
        }

        // Add authorization header
        const token = this.getStoredToken();
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

    // Response interceptor - handle token refresh and errors
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
          console.log(
            `✅ [${response.status}] ${response.config.url}`,
            response.data
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await this.handleTokenRefresh();
          
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          }
        }

        // Log error in development
        if (import.meta.env.DEV) {
          console.error(
            `❌ [${error.response?.status || "ERROR"}] ${originalRequest.url}`,
            error.response?.data || error.message
          );
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  /**
   * Retrieve token from Zustand store
   */
  private getStoredToken(): string | null {
    const store = useUserStore.getState();
    return store.token || null;
  }

  /**
   * Token refresh with deduplication to prevent multiple concurrent requests
   */
  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.tryRefreshToken()
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  /**
   * Attempt to refresh access token
   */
  private async tryRefreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      this.clearSession();
      return null;
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/api/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      );

      const data = response.data?.data || response.data;
      const newToken = data?.accessToken || data?.token;
      const newRefreshToken = data?.refreshToken;
      const user = data?.user;

      if (!newToken) {
        this.clearSession();
        return null;
      }

      // Update store with new tokens
      const store = useUserStore.getState();
      store.setToken(newToken);
      if (user) store.setUser(user);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      return newToken;
    } catch (error) {
      console.error("❌ Token refresh failed", error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Clear session on auth failure
   */
  private clearSession(): void {
    const store = useUserStore.getState();
    store.clearSession();
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }

  /**
   * Transform Axios error to custom HttpError
   */
  private transformError(error: AxiosError): HttpError {
    const statusCode = error.response?.status || 500;
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "Unknown error";
    const data = error.response?.data;

    return new HttpError(statusCode, message, data);
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Support for AbortController for request cancellation
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

/**
 * Default HTTP client instance (for direct use if needed)
 */
export const httpClient = new (class extends HttpClient {})();
