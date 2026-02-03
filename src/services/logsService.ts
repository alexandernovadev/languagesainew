import { api } from "./api";

export interface LogFileInfo {
  name: string;
  size: number;
  sizeFormatted: string;
  modified: string;
  path: string;
  lineCount?: number;
}

export interface LogsListResponse {
  success: boolean;
  message: string;
  data: {
    logs: LogFileInfo[];
    totalSize: string;
    totalFiles: number;
  };
}

export interface LogContentResponse {
  success: boolean;
  message: string;
  data: {
    logName: string;
    pagination: {
      currentPage: number;
      totalPages: number;
      linesPerPage: number;
      totalLines: number;
      filteredLines: number;
      hasMore: boolean;
    };
    filters: {
      search: string | null;
      level: string | null;
      startDate: string | null;
      endDate: string | null;
    };
    lines: string[];
    fileInfo: {
      size: string;
      modified: string;
    };
  };
}

export interface LogDeleteResponse {
  success: boolean;
  message: string;
  data: {
    logName?: string;
    clearedLogs?: string[];
    totalCleared?: number;
    clearedAt: string;
  };
}

class LogsService {
  /**
   * Get list of available log files
   */
  async getLogsList(): Promise<LogsListResponse> {
    const response = await api.get("/api/labs/logs");
    return response.data;
  }

  /**
   * Get log content with filters and pagination
   */
  async getLogContent(
    logName: string,
    params?: {
      lines?: number;
      page?: number;
      search?: string;
      level?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<LogContentResponse> {
    const response = await api.get(`/api/labs/logs/${logName}`, {
      params,
    });
    return response.data;
  }

  /**
   * Download log file
   */
  async downloadLog(logName: string, compress: boolean = false): Promise<Blob> {
    const response = await api.get(`/api/labs/logs/${logName}/download`, {
      params: { compress: compress ? "true" : "false" },
      responseType: "blob",
    });
    return response.data;
  }

  /**
   * Delete a log file
   */
  async deleteLog(logName: string): Promise<LogDeleteResponse> {
    const response = await api.delete(`/api/labs/logs/${logName}`);
    return response.data;
  }

  /**
   * Delete all log files
   */
  async deleteAllLogs(): Promise<LogDeleteResponse> {
    const response = await api.delete("/api/labs/logs");
    return response.data;
  }
}

export const logsService = new LogsService();
