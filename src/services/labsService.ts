import { api } from "./api";

export interface LabsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface UpdateWordsLevelRequest {
  level: "easy" | "medium" | "hard";
}

export interface ResetWordsSeenRequest {
  seen?: number;
}

export interface UpdateLecturesLanguageRequest {
  language: string;
}

export interface DatabaseStats {
  totalWords: number;
  totalLectures: number;
  timestamp: string;
}

export interface CleanerResponse {
  deletedCount?: number;
  totalFound?: number;
  deletedExams?: number;
  deletedAttempts?: number;
  totalExamsFound?: number;
  totalAttemptsFound?: number;
  totalQuestionsBefore?: number;
  message: string;
}

class LabsService {
  // Database Operations
  async updateWordsLevel(data: UpdateWordsLevelRequest): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/words/update-level", data);
    return response.data;
  }

  async resetWordsSeenCount(
    data: ResetWordsSeenRequest = { seen: 0 }
  ): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/words/reset-seen", data);
    return response.data;
  }

  async updateLecturesLanguage(data: UpdateLecturesLanguageRequest): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/lectures/update-language", data);
    return response.data;
  }

  async recalculateLecturesTime(): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/lectures/recalculate-time");
    return response.data;
  }

  // User Management
  async createAdminUser(): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/users/create-admin");
    return response.data;
  }

  async createTestUsers(): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/users/create-test-users");
    return response.data;
  }

  // Data Seeding
  async seedInitialData(): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/seed/initial-data");
    return response.data;
  }

  async seedQuestionsFromJson(): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/seed/questions");
    return response.data;
  }

  // Backup & Maintenance
  async createBackup(): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/backup/create");
    return response.data;
  }

  async clearAllData(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/data/clear-all");
    return response.data;
  }

  // Migration
  async migrateWordsToReviewSystem(): Promise<LabsResponse> {
    const response = await api.post("/api/fixes/migrate/words-to-review");
    return response.data;
  }

  // Statistics
  async getDatabaseStats(): Promise<LabsResponse> {
    const response = await api.get("/api/fixes/stats/database");
    return response.data;
  }

  // Cleaner Functions (DANGEROUS - requires authentication)
  async cleanExamAttempts(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/clean/exam-attempts");
    return response.data;
  }

  async cleanExams(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/clean/exams");
    return response.data;
  }

  async cleanQuestions(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/clean/questions");
    return response.data;
  }

  async cleanWords(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/clean/words");
    return response.data;
  }

  async cleanLectures(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/clean/lectures");
    return response.data;
  }

  async cleanExpressions(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/clean/expressions");
    return response.data;
  }

  async cleanUsers(): Promise<LabsResponse> {
    const response = await api.delete("/api/fixes/clean/users");
    return response.data;
  }
}

export const labsService = new LabsService();
