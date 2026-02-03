import { api } from "./api";

export interface Log {
  _id: string;
  errorMessage: string;
  statusCode: number;
  errorData?: any;
  stack?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogsListResponse {
  success: boolean;
  message: string;
  data: {
    logs: Log[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface LogStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    byStatusCode: Record<number, number>;
    recentErrors: number;
    recentErrorsCount: number;
  };
}

export interface LogQueryParams {
  page?: number;
  limit?: number;
  statusCode?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

class LogsService {
  /**
   * Get logs with pagination and filters
   */
  async getLogs(params?: LogQueryParams): Promise<LogsListResponse> {
    const response = await api.get("/api/logs", { params });
    return response.data;
  }

  /**
   * Get log statistics
   */
  async getLogStats(): Promise<LogStatsResponse> {
    const response = await api.get("/api/logs/stats");
    return response.data;
  }

  /**
   * Get log by ID
   */
  async getLogById(id: string) {
    const response = await api.get(`/api/logs/${id}`);
    return response.data;
  }

  /**
   * Delete log by ID
   */
  async deleteLog(id: string) {
    const response = await api.delete(`/api/logs/${id}`);
    return response.data;
  }

  /**
   * Delete logs with filters
   */
  async deleteLogs(params?: LogQueryParams) {
    const response = await api.delete("/api/logs", { params });
    return response.data;
  }
}

export const logsService = new LogsService();
