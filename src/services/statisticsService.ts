import { api } from "./api";

export const statisticsService = {
  async getStatistics() {
    const res = await api.get("/statistics");
    return res.data;
  },
};
