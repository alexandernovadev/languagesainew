import { api } from './api';

export interface ExamGenerationParams {
  topic: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  numberOfQuestions?: number;
  types?: string[];
  difficulty?: number;
  userLang?: string;
}

export interface ExamGenerationResponse {
  success: boolean;
  message: string;
  data: {
    exam: any;
    questions: any[];
  };
}

export interface Exam {
  _id: string;
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
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ExamListResponse {
  success: boolean;
  message: string;
  data: {
    data: Exam[];
    page: number;
    pages: number;
    total: number;
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

export interface ExamQuestion {
  text: string;
  type: string;
  isSingleAnswer: boolean;
  options?: Array<{
    value: string;
    label: string;
    isCorrect: boolean;
  }>;
  correctAnswers: string[];
  explanation?: string;
  tags?: string[];
}

// Interfaz unificada para preguntas de examen
export interface UnifiedExamQuestion extends ExamQuestion {
  // Campos adicionales para compatibilidad
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty?: number;
  topic?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const examService = {
  // Get all exams with pagination and filters
  async getExams(queryParams?: string): Promise<ExamListResponse> {
    const url = queryParams ? `/api/exams?${queryParams}` : '/api/exams';
    const response = await api.get(url);
    return response.data;
  },

  // Get exam by ID
  async getExam(id: string): Promise<ExamResponse> {
    const response = await api.get(`/api/exams/${id}`);
    return response.data;
  },

  // Create new exam
  async createExam(examData: CreateExamRequest): Promise<ExamResponse> {
    const response = await api.post('/api/exams', examData);
    return response.data;
  },

  // Update exam
  async updateExam(id: string, examData: UpdateExamRequest): Promise<ExamResponse> {
    const response = await api.put(`/api/exams/${id}`, examData);
    return response.data;
  },

  // Delete exam
  async deleteExam(id: string): Promise<ExamResponse> {
    const response = await api.delete(`/api/exams/${id}`);
    return response.data;
  },

  // Get exam statistics
  async getExamStats(): Promise<{ success: boolean; message: string; data: ExamStats }> {
    const response = await api.get('/api/exams/stats');
    return response.data;
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
    const response = await api.post('/api/exams/generate', data);
    return response.data;
  },

  // Get exams by language
  async getExamsByLanguage(language: string, limit?: number): Promise<{ success: boolean; message: string; data: Exam[] }> {
    const url = limit ? `/api/exams/language/${language}?limit=${limit}` : `/api/exams/language/${language}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get exams by level
  async getExamsByLevel(level: string, limit?: number): Promise<{ success: boolean; message: string; data: Exam[] }> {
    const url = limit ? `/api/exams/level/${level}?limit=${limit}` : `/api/exams/level/${level}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get exams by level and language
  async getExamsByLevelAndLanguage(level: string, language: string): Promise<{ success: boolean; message: string; data: Exam[] }> {
    const response = await api.get(`/api/exams/level/${level}/language/${language}`);
    return response.data;
  },

  // Get exams by topic
  async getExamsByTopic(topic: string): Promise<{ success: boolean; message: string; data: Exam[] }> {
    const response = await api.get(`/api/exams/topic/${topic}`);
    return response.data;
  },

  // Get exams by creator
  async getExamsByCreator(creatorId: string): Promise<{ success: boolean; message: string; data: Exam[] }> {
    const response = await api.get(`/api/exams/creator/${creatorId}`);
    return response.data;
  },

  // Add question to exam
  async addQuestionToExam(examId: string, questionId: string, weight?: number, order?: number): Promise<ExamResponse> {
    const response = await api.post(`/api/exams/${examId}/questions`, {
      questionId,
      weight: weight || 1,
      order: order || 0
    });
    return response.data;
  },

  // Remove question from exam
  async removeQuestionFromExam(examId: string, questionId: string): Promise<ExamResponse> {
    const response = await api.delete(`/api/exams/${examId}/questions/${questionId}`);
    return response.data;
  },

  // Original methods for AI exam generation
  async generateExam(params: ExamGenerationParams): Promise<ExamGenerationResponse> {
    const response = await api.post('/api/ai/generate-exam', {
      topic: params.topic,
      level: params.level || 'B1',
      numberOfQuestions: params.numberOfQuestions || 10,
      types: params.types || ['multiple_choice', 'fill_blank', 'true_false'],
      difficulty: params.difficulty || 3,
      userLang: params.userLang || 'es'
    });

    return response.data;
  },

  // Save exam with questions
  async saveExamWithQuestions(examData: {
    title: string;
    level: string;
    difficulty: string;
    topic: string;
    questions: UnifiedExamQuestion[];
  }): Promise<any> {
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
    });

    return response.data;
  },

  // Generate exam with progress tracking
  async generateExamWithProgress(
    params: ExamGenerationParams,
    onProgress?: (data: any) => void
  ): Promise<ExamGenerationResponse> {
    const response = await api.post('/api/ai/generate-exam', {
      topic: params.topic,
      level: params.level || 'B1',
      numberOfQuestions: params.numberOfQuestions || 10,
      types: params.types || ['multiple_choice', 'fill_blank', 'true_false'],
      difficulty: params.difficulty || 3,
      userLang: params.userLang || 'es'
    }, {
      onDownloadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent);
        }
      }
    });

    return response.data;
  }
}; 