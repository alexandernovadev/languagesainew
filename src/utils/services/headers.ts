import { useUserStore } from "@/lib/store/user-store";

/**
 * Generates authentication headers for API requests
 * 
 * This function retrieves the user's authentication token from the store
 * and returns the appropriate headers for making authenticated API requests.
 * If no token is available, it returns headers without authentication.
 * 
 * @returns An object containing the Authorization header with Bearer token
 *          and Content-Type header, or just Content-Type if no token exists
 * 
 * @example
 * ```typescript
 * const headers = getAuthHeaders();
 * // Returns: { Authorization: "Bearer token123", "Content-Type": "application/json" }
 * 
 * // Or if no token:
 * // Returns: { "Content-Type": "application/json" }
 * ```
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/words', {
 *   headers: getAuthHeaders()
 * });
 * ```
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = useUserStore.getState().token;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}; 