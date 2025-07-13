import { api } from "./api";

export const statisticsService = {
  async getDashboardStats() {
    const res = await api.get("/api/statistics/dashboard");
    return res.data.data;
  },

  async getBasicStats() {
    const res = await api.get("/api/statistics");
    return res.data.data;
  },

  async getLectureStats() {
    const res = await api.get("/api/statistics/lectures");
    return res.data.data;
  },

  async getWordStats() {
    const res = await api.get("/api/statistics/words");
    return res.data.data;
  }
}; 