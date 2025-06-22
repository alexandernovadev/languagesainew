import { api } from "./api";
import { getAuthHeaders } from "./utils/headers";

export const statisticsService = {
  async getStatistics() {
    const res = await api.get("/statistics", { headers: getAuthHeaders() });
    return res.data;
  },
};
