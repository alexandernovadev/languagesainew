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
    const res = await api.post("/api/auth/login", { username, password });
    return res.data;
  },
};
