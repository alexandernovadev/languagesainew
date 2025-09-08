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
}

export const labsService = new LabsService();