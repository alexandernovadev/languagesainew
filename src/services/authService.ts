import { api } from "./api";

const handleResponseToken = async (response: Response) => {
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || `Error: ${response.statusText}`);
  }
  return data.data.token;
};

export const authService = {
  async login(username: string, password: string) {
    try {
      const res = await api.post("/api/auth/login", { username, password });
      return res.data;
    } catch (error: any) {
      // Handle Axios error response
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },
};
