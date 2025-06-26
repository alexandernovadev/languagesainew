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

export const examService = {
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