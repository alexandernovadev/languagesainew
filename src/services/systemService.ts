import { api } from "./api";

export interface SystemInfo {
  date: string;
  version: string;
  environment: string;
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  data: SystemInfo;
}

export const systemService = {
  async getHealthCheck(): Promise<HealthCheckResponse> {
    const response = await api.get<HealthCheckResponse>("/");
    return response.data;
  },
};
