import { api } from "./api";
import { DashboardStats } from "@/types/stats";

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<{ success: boolean; message: string; data: DashboardStats }>("/api/stats/dashboard");
    return res.data.data;
  },
};
