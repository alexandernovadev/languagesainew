import {
  QuestionInput,
  QuestionFilters,
  QuestionStats,
} from "../models/Question";
import { api } from "./api";

export const questionService = {
  async getQuestions(
    page: number,
    limit: number,
    filters?: Partial<QuestionFilters>
  ) {
    // Construir query params
    const params = new URLSearchParams();

    // Parámetros básicos
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    // Agregar filtros si existen
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const url = `/api/questions?${params.toString()}`;
    const res = await api.get(url);
    return res.data;
  },

  async getQuestionById(id: string) {
    const res = await api.get(`/api/questions/${id}`);
    return res.data;
  },

  async createQuestion(questionData: QuestionInput) {
    const res = await api.post(`/api/questions`, questionData);
    return res.data;
  },

  async updateQuestion(id: string, questionData: Partial<QuestionInput>) {
    const res = await api.put(`/api/questions/${id}`, questionData);
    return res.data;
  },

  async deleteQuestion(id: string) {
    const res = await api.delete(`/api/questions/${id}`);
    return res.data;
  },

  async getQuestionStats(): Promise<{
    success: boolean;
    message: string;
    data: QuestionStats;
  }> {
    const res = await api.get(`/api/questions/stats`);
    return res.data;
  },

  async getQuestionsByLevel(level: string, limit: number = 10) {
    const res = await api.get(`/api/questions/level/${level}?limit=${limit}`);
    return res.data;
  },

  async getQuestionsByLevelAndType(level: string, type: string) {
    const res = await api.get(`/api/questions/level/${level}/type/${type}`);
    return res.data;
  },

  async getQuestionsByTopic(topic: string) {
    const res = await api.get(`/api/questions/topic/${topic}`);
    return res.data;
  },

  async getQuestionsByTags(tags: string) {
    const res = await api.get(`/api/questions/tags/${tags}`);
    return res.data;
  },

  async getRandomQuestions(level: string, type: string, limit = 5) {
    const res = await api.get(
      `/api/questions/random?level=${level}&type=${type}&limit=${limit}`
    );
    return res.data;
  },

  // Export questions to JSON
  async exportQuestions() {
    const response = await api.get("/api/questions/export-file");
    return response.data;
  },

  // Import questions from JSON file
  async importQuestions(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/questions/import-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
