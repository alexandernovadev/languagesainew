import { useUserStore } from "@/lib/store/user-store";

export const getAuthHeaders = (): Record<string, string> => {
  const token = useUserStore.getState().token;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}; 