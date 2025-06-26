import { api } from './api';
import { getAuthHeaders } from '@/utils/services';
import { ExamAttempt, CanCreateAttempt, UserStats } from '@/lib/store/useExamAttemptStore';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateAttemptRequest {
  user: string;
  exam: string;
  attemptNumber?: number;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answer: any;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
}

export interface GradeAttemptRequest {
  aiEvaluation: {
    grammar?: number;
    fluency?: number;
    coherence?: number;
    vocabulary?: number;
    comments?: string;
  };
  cefrEstimated?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  aiNotes?: string;
}

export const examAttemptService = {
  // Check if user can create a new attempt
  async checkCanCreateAttempt(userId: string, examId: string): Promise<CanCreateAttempt> {
    console.log("🌐 examAttemptService.checkCanCreateAttempt called", { userId, examId });
    
    try {
      const headers = getAuthHeaders();
      console.log("🔑 Auth headers:", headers);
      
      const url = `/api/exam-attempts/user/${userId}/exam/${examId}/can-create`;
      console.log("📡 Making request to:", url);
      
      const response = await api.get(url, {
        headers
      });
      
      console.log("📥 Response received:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("💥 Error in checkCanCreateAttempt:", error);
      console.error("💥 Error response:", error.response?.data);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al verificar si puede crear intento");
      }
    }
  },

  // Create a new exam attempt
  async createAttempt(data: CreateAttemptRequest): Promise<ExamAttempt> {
    console.log("🌐 examAttemptService.createAttempt called", data);
    
    try {
      const headers = getAuthHeaders();
      console.log("🔑 Auth headers:", headers);
      
      console.log("📡 Making POST request to /api/exam-attempts");
      
      const response = await api.post('/api/exam-attempts', data, {
        headers
      });
      
      console.log("📥 Create attempt response:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("💥 Error in createAttempt:", error);
      console.error("💥 Error response:", error.response?.data);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al crear el intento");
      }
    }
  },

  // Submit an individual answer
  async submitAnswer(attemptId: string, data: SubmitAnswerRequest): Promise<ExamAttempt> {
    try {
      const response = await api.post(`/api/exam-attempts/${attemptId}/submit-answer`, data, {
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al enviar la respuesta");
      }
    }
  },

  // Submit the exam attempt (finish)
  async submitAttempt(attemptId: string): Promise<ExamAttempt> {
    try {
      const response = await api.post(`/api/exam-attempts/${attemptId}/submit`, {}, {
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al finalizar el examen");
      }
    }
  },

  // Grade the exam attempt (after AI evaluation)
  async gradeAttempt(attemptId: string, data: GradeAttemptRequest): Promise<ExamAttempt> {
    try {
      const response = await api.post(`/api/exam-attempts/${attemptId}/grade`, data, {
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al calificar el examen");
      }
    }
  },

  // Get attempt history for a user and exam
  async getAttemptHistory(userId: string, examId: string): Promise<ExamAttempt[]> {
    try {
      const response = await api.get(`/api/exam-attempts/user/${userId}/exam/${examId}`, {
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener el historial de intentos");
      }
    }
  },

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const response = await api.get(`/api/exam-attempts/user/${userId}/stats`, {
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener estadísticas del usuario");
      }
    }
  },

  // Get a specific attempt by ID
  async getAttempt(attemptId: string): Promise<ExamAttempt> {
    try {
      const response = await api.get(`/api/exam-attempts/${attemptId}`, {
        headers: getAuthHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener el intento");
      }
    }
  }
}; 