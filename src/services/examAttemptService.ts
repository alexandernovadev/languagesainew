import { api } from './api';

export interface ExamAnswer {
  questionId: string;
  questionText: string;
  options: {
    value: string;
    label: string;
    isCorrect: boolean;
  }[];
  userAnswer: string[];
  aiComment?: string;
  isCorrect?: boolean;
  points?: number;
}

export interface ExamAttempt {
  _id: string;
  exam: {
    _id: string;
    title: string;
    level: string;
    language: string;
    topic?: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'in_progress' | 'submitted' | 'graded' | 'abandoned';
  startTime: string;
  submittedAt?: string;
  gradedAt?: string;
  score?: number;
  maxScore?: number;
  aiFeedback?: string;
  answers?: ExamAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface AttemptStats {
  totalAttempts: number;
  completedAttempts: number;
  inProgressAttempts: number;
  averageScore: number;
  bestScore: number;
  lastAttempt?: ExamAttempt;
  averageScoreByLevel?: Record<string, number>;
  attemptsByLanguage?: Record<string, number>;
  averageTimePerQuestion?: number;
  averageCompletionTime?: number;
  totalStudyTime?: number;
}

export interface StartAttemptRequest {
  examId: string;
}

export interface SubmitAttemptRequest {
  answers: ExamAnswer[];
}

class ExamAttemptService {
  // POST /api/exam-attempts/start
  async startAttempt(examId: string): Promise<ExamAttempt> {
    const response = await api.post('/api/exam-attempts/start', { examId });
    return response.data.data;
  }

  // GET /api/exam-attempts/in-progress/:examId
  async getInProgressAttempt(examId: string): Promise<ExamAttempt | null> {
    try {
      const response = await api.get(`/api/exam-attempts/in-progress/${examId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // POST /api/exam-attempts/:id/submit
  async submitAttempt(attemptId: string, answers: ExamAnswer[]): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/submit`, { answers });
    return response.data.data;
  }

  // POST /api/exam-attempts/:id/grade
  async gradeAttempt(attemptId: string): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/grade`);
    return response.data.data;
  }

  // GET /api/exam-attempts/user/:userId
  async getUserAttempts(userId: string): Promise<ExamAttempt[]> {
    const response = await api.get(`/api/exam-attempts/user/${userId}`);
    return response.data.data;
  }

  // GET /api/exam-attempts/:id
  async getAttemptDetails(attemptId: string): Promise<ExamAttempt> {
    const response = await api.get(`/api/exam-attempts/${attemptId}`);
    return response.data.data;
  }

  // POST /api/exam-attempts/:id/abandon
  async abandonAttempt(attemptId: string): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/abandon`);
    return response.data.data;
  }

  // GET /api/exam-attempts/stats/:userId
  async getAttemptStats(userId: string, examId?: string): Promise<AttemptStats> {
    const params = examId ? { examId } : {};
    const response = await api.get(`/api/exam-attempts/stats/${userId}`, { params });
    return response.data.data;
  }

  // GET /api/exams/with-attempts
  async getExamsWithAttempts(params?: {
    page?: number;
    limit?: number;
    level?: string[];
    language?: string[];
    topic?: string;
    source?: string;
    createdBy?: string;
    adaptive?: boolean;
    sortBy?: string;
    sortOrder?: string;
    createdAfter?: string;
    createdBefore?: string;
  }): Promise<{
    data: Array<{
      _id: string;
      title: string;
      description: string;
      language: string;
      level: string;
      topic: string;
      source: string;
      timeLimit: number;
      adaptive: boolean;
      maxAttempts: number;
      userAttempts: ExamAttempt[];
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const response = await api.get(`/api/exams/with-attempts?${queryParams.toString()}`);
    return response.data.data;
  }

  // GET /api/exams/:id/attempt-stats
  async getExamAttemptStats(examId: string): Promise<AttemptStats> {
    const response = await api.get(`/api/exams/${examId}/attempt-stats`);
    return response.data.data;
  }
}

export const examAttemptService = new ExamAttemptService(); 