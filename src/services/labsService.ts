import { api } from "./api";

export interface LabsResponse {
  success: boolean;
  message: string;
  data?: any;
}

// TODO como asi que se repite esto ?
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
  message: string;
}

class LabsService {
  // Database Operations
  async updateWordsLevel(data: UpdateWordsLevelRequest): Promise<LabsResponse> {
    const response = await api.post("/api/labs/words/update-level", data);
    return response.data;
  }

  async resetWordsSeenCount(
    data: ResetWordsSeenRequest = { seen: 0 }
  ): Promise<LabsResponse> {
    const response = await api.post("/api/labs/words/reset-seen", data);
    return response.data;
  }

  async updateLecturesLanguage(data: UpdateLecturesLanguageRequest): Promise<LabsResponse> {
    const response = await api.post("/api/labs/lectures/update-language", data);
    return response.data;
  }

  async recalculateLecturesTime(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/lectures/recalculate-time");
    return response.data;
  }

  // User Management
  async createAdminUser(): Promise<LabsResponse> {
    const response = await fetch("http://localhost:3000/api/labs/users/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.data;
  }

  async createTestUsers(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/users/create-test-users");
    return response.data;
  }

  // Data Seeding
  async seedInitialData(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/seed/initial-data");
    return response.data;
  }

  async seedQuestionsFromJson(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/seed/questions-from-json");
    return response.data;
  }

  // Backup & Maintenance
  async createBackup(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/backup/create");
    return response.data;
  }

  async sendBackupByEmail(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/backup/send-now");
    return response.data;
  }

  async clearAllData(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/data/clear-all");
    return response.data;
  }

  // Migration
  async migrateWordsToReviewSystem(): Promise<LabsResponse> {
    const response = await api.post("/api/labs/migrate/words-to-review");
    return response.data;
  }

  // Statistics
  async getDatabaseStats(): Promise<LabsResponse> {
    const response = await api.get("/api/labs/stats/database");
    return response.data;
  }

  // Cleaner Functions (DANGEROUS - requires authentication)
  async cleanWords(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/clean/words");
    return response.data;
  }

  async cleanLectures(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/clean/lectures");
    return response.data;
  }

  async cleanExpressions(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/clean/expressions");
    return response.data;
  }

  async cleanTranslationChatsAndTexts(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/clean/translation-chats-and-texts");
    return response.data;
  }

  async cleanUsers(): Promise<LabsResponse> {
    const response = await api.delete("/api/labs/clean/users");
    return response.data;
  }
}

export const labsService = new LabsService();
