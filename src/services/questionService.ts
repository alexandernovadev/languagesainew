import { Question, QuestionInput, QuestionFilters, QuestionStats } from "../models/Question";
import { getAuthHeaders } from "@/utils/services";
import { api } from "./api";

export const questionService = {
  async getQuestions(page: number, limit: number, filters?: Partial<QuestionFilters>) {
    try {
      // Construir query params
      const params = new URLSearchParams();
      
      // Parámetros básicos
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      // Agregar filtros si existen
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }
      
      const url = `/api/questions?${params.toString()}`;
      const res = await api.get(url, { headers: getAuthHeaders() });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getQuestionById(id: string) {
    try {
      const res = await api.get(`/api/questions/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async createQuestion(questionData: QuestionInput) {
    try {
      const res = await api.post(`/api/questions`, questionData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async updateQuestion(id: string, questionData: Partial<QuestionInput>) {
    try {
      const res = await api.put(`/api/questions/${id}`, questionData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async deleteQuestion(id: string) {
    try {
      const res = await api.delete(`/api/questions/${id}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getQuestionStats(): Promise<{ success: boolean; message: string; data: QuestionStats }> {
    try {
      const res = await api.get(`/api/questions/stats`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getQuestionsByLevel(level: string, limit: number = 10) {
    try {
      const res = await api.get(`/api/questions/level/${level}?limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getQuestionsByLevelAndType(level: string, type: string) {
    try {
      const res = await api.get(`/api/questions/level/${level}/type/${type}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getQuestionsByTopic(topic: string) {
    try {
      const res = await api.get(`/api/questions/topic/${topic}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getQuestionsByTags(tags: string) {
    try {
      const res = await api.get(`/api/questions/tags/${tags}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },

  async getRandomQuestions(level: string, type: string, limit: number = 5) {
    try {
      const res = await api.get(`/api/questions/random/${level}/${type}?limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error de conexión");
      }
    }
  },
}; 