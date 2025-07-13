import { api } from "./api";

export const statisticsService = {
  async getDashboardStats() {
    const res = await api.get("/api/statistics/dashboard");
    return res.data.data; // Acceder al data dentro del response
  },

  async getBasicStats() {
    const res = await api.get("/api/statistics");
    return res.data.data; // Acceder al data dentro del response
  }
}; 