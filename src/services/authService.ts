import { api } from "./api";

export const authService = {
  async login(username: string, password: string) {
    // Los interceptores globales ya manejan los errores HTTP
    // Solo necesitamos hacer la petición y retornar los datos
    const res = await api.post("/api/auth/login", { username, password });
    return res.data;
  },
};
