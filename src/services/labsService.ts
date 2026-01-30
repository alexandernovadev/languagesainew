import { api } from "./api";

export interface LabsResponse {
  success: boolean;
  message: string;
  data?: any;
}

class LabsService {
  // User Management
  async createAdminUser(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/users/create-admin");
    return response.data;
  }

  // Backup & Maintenance
  async sendBackupByEmail(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/backup/send-email");
    return response.data;
  }

  // Data Management - Dangerous Operations ⚠️
  async deleteAllWords(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/data/words/delete-all");
    return response.data;
  }

  async deleteAllExpressions(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/data/expressions/delete-all");
    return response.data;
  }

  async deleteAllLectures(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/data/lectures/delete-all");
    return response.data;
  }
}

export const labsService = new LabsService();