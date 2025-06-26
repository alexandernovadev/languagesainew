import { api } from './api';
import { getAuthHeaders } from '@/utils/services';

export interface ExamGenerationParams {
  topic: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  numberOfQuestions?: number;
  types?: ('multiple_choice' | 'fill_blank' | 'true_false' | 'translate' | 'writing')[];
  difficulty?: number;
  userLang?: string;
}

export interface ExamQuestion {
  text: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'translate' | 'writing';
  isSingleAnswer: boolean;
  options?: {
    value: string;
    label: string;
    isCorrect: boolean;
  }[];
  correctAnswers: string[];
  explanation: string;
  tags: string[];
}

export interface ExamGenerationResponse {
  questions: ExamQuestion[];
}

export interface Exam {
  _id: string;
  title: string;
  description: string;
  language: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic: string;
  source: 'manual' | 'ai';
  attemptsAllowed: number;
  timeLimit: number;
  adaptive: boolean;
  version: number;
  questions: Array<{
    question: string;
    weight: number;
    order: number;
  }>;
  createdBy: string;
  metadata?: {
    difficultyScore: number;
    estimatedDuration: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  language: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic?: string;
  source?: 'manual' | 'ai';
  attemptsAllowed?: number;
  timeLimit?: number;
  adaptive?: boolean;
  version?: number;
  questions?: Array<{
    question: string;
    weight?: number;
    order?: number;
  }>;
  createdBy?: string;
  metadata?: {
    difficultyScore?: number;
    estimatedDuration?: number;
  };
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  language?: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic?: string;
  source?: 'manual' | 'ai';
  attemptsAllowed?: number;
  timeLimit?: number;
  adaptive?: boolean;
  version?: number;
  questions?: Array<{
    question: string;
    weight?: number;
    order?: number;
  }>;
  metadata?: {
    difficultyScore?: number;
    estimatedDuration?: number;
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ExamListResponse {
  success: boolean;
  message: string;
  data: {
    data: Exam[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface ExamResponse {
  success: boolean;
  message: string;
  data: Exam;
}

export interface ExamStats {
  totalExams: number;
  examsByLevel: Record<string, number>;
  examsByLanguage: Record<string, number>;
  adaptiveExams: number;
  averageQuestionsPerExam: number;
}

export const examService = {
  // Get all exams with pagination and filters
  async getExams(queryParams?: string): Promise<ExamListResponse> {
    try {
      const url = queryParams ? `/api/exams?${queryParams}` : '/api/exams';
      const response = await api.get(url, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener los exámenes");
      }
    }
  },

  // Get exam by ID
  async getExam(id: string): Promise<ExamResponse> {
    try {
      const response = await api.get(`/api/exams/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener el examen");
      }
    }
  },

  // Create new exam
  async createExam(examData: CreateExamRequest): Promise<ExamResponse> {
    try {
      const response = await api.post('/api/exams', examData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al crear el examen");
      }
    }
  },

  // Update exam
  async updateExam(id: string, examData: UpdateExamRequest): Promise<ExamResponse> {
    try {
      const response = await api.put(`/api/exams/${id}`, examData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al actualizar el examen");
      }
    }
  },

  // Delete exam
  async deleteExam(id: string): Promise<ExamResponse> {
    try {
      const response = await api.delete(`/api/exams/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al eliminar el examen");
      }
    }
  },

  // Get exam statistics
  async getExamStats(): Promise<{ success: boolean; message: string; data: ExamStats }> {
    try {
      const response = await api.get('/api/exams/stats', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener estadísticas de exámenes");
      }
    }
  },

  // Generate exam from questions
  async generateExamFromQuestions(data: {
    questions: string[];
    title: string;
    language: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    description?: string;
    topic?: string;
    source?: 'manual' | 'ai';
    attemptsAllowed?: number;
    timeLimit?: number;
    adaptive?: boolean;
    createdBy?: string;
  }): Promise<ExamResponse> {
    try {
      const response = await api.post('/api/exams/generate', data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al generar el examen");
      }
    }
  },

  // Get exams by level
  async getExamsByLevel(level: string, limit?: number): Promise<{ success: boolean; message: string; data: Exam[] }> {
    try {
      const url = limit ? `/api/exams/level/${level}?limit=${limit}` : `/api/exams/level/${level}`;
      const response = await api.get(url, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener exámenes por nivel");
      }
    }
  },

  // Get exams by level and language
  async getExamsByLevelAndLanguage(level: string, language: string): Promise<{ success: boolean; message: string; data: Exam[] }> {
    try {
      const response = await api.get(`/api/exams/level/${level}/language/${language}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener exámenes por nivel e idioma");
      }
    }
  },

  // Get exams by topic
  async getExamsByTopic(topic: string): Promise<{ success: boolean; message: string; data: Exam[] }> {
    try {
      const response = await api.get(`/api/exams/topic/${topic}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener exámenes por tema");
      }
    }
  },

  // Get exams by creator
  async getExamsByCreator(creatorId: string): Promise<{ success: boolean; message: string; data: Exam[] }> {
    try {
      const response = await api.get(`/api/exams/creator/${creatorId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al obtener exámenes por creador");
      }
    }
  },

  // Add question to exam
  async addQuestionToExam(examId: string, questionId: string, weight?: number, order?: number): Promise<ExamResponse> {
    try {
      const response = await api.post(`/api/exams/${examId}/questions`, {
        questionId,
        weight: weight || 1,
        order: order || 0
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al agregar pregunta al examen");
      }
    }
  },

  // Remove question from exam
  async removeQuestionFromExam(examId: string, questionId: string): Promise<ExamResponse> {
    try {
      const response = await api.delete(`/api/exams/${examId}/questions/${questionId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Error al remover pregunta del examen");
      }
    }
  },

  // Original methods for AI exam generation
  async generateExam(params: ExamGenerationParams): Promise<ExamGenerationResponse> {
    try {
      const response = await api.post('/api/ai/generate-exam', {
        topic: params.topic,
        level: params.level || 'B1',
        numberOfQuestions: params.numberOfQuestions || 10,
        types: params.types || ['multiple_choice', 'fill_blank', 'true_false'],
        difficulty: params.difficulty || 3,
        userLang: params.userLang || 'es'
      }, {
        headers: getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error("Error al generar el examen");
      } else {
        throw new Error("Error al generar el examen");
      }
    }
  },

  async saveExamWithQuestions(examData: {
    title: string;
    topic: string;
    level: string;
    difficulty: string;
    questions: ExamQuestion[];
  }): Promise<any> {
    try {
      // Transformar las preguntas al formato esperado por la API
      const questions = examData.questions.map(question => ({
        text: question.text,
        type: question.type,
        isSingleAnswer: question.isSingleAnswer,
        level: examData.level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
        difficulty: parseInt(examData.difficulty),
        topic: examData.topic,
        options: question.options,
        correctAnswers: question.correctAnswers,
        explanation: question.explanation,
        tags: question.tags
      }));

      const response = await api.post('/api/exams/with-questions', {
        title: examData.title,
        language: 'es', // Por defecto español
        level: examData.level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
        topic: examData.topic,
        description: `Examen sobre ${examData.topic}`,
        source: 'ai',
        attemptsAllowed: 3,
        timeLimit: 60, // 60 minutos por defecto
        adaptive: false,
        questions: questions
      }, {
        headers: getAuthHeaders()
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error al guardar el examen");
      }
    }
  },

  async generateExamStream(
    params: ExamGenerationParams,
    onProgress?: (data: any) => void
  ): Promise<ExamGenerationResponse> {
    try {
      const response = await api.post('/api/ai/generate-exam', {
        topic: params.topic,
        level: params.level || 'B1',
        numberOfQuestions: params.numberOfQuestions || 10,
        types: params.types || ['multiple_choice', 'fill_blank', 'true_false'],
        difficulty: params.difficulty || 3,
        userLang: params.userLang || 'es'
      }, {
        headers: getAuthHeaders(),
        onDownloadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent);
          }
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Error al generar el examen");
      }
    }
  }
}; 