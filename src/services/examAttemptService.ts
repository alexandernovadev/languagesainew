import { api } from './api';

export interface ExamAttempt {
  _id: string;
  user: string;
  exam: string;
  attemptNumber: number;
  answers: Array<{
    question: string;
    answer: any;
    submittedAt: string;
  }>;
  startedAt: string;
  submittedAt?: string;
  duration?: number;
  status: 'in_progress' | 'submitted' | 'graded';
  passed?: boolean;
  userNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answer: any;
}

export interface CreateAttemptRequest {
  userId: string;
  examId: string;
  attemptNumber?: number;
}

export const examAttemptService = {
  // Create a new exam attempt
  async createAttempt(data: CreateAttemptRequest): Promise<ExamAttempt> {
    const response = await api.post("/api/exam-attempts", data);
    return response.data.data;
  },

  // Get exam attempt by ID
  async getAttempt(attemptId: string): Promise<ExamAttempt> {
    const response = await api.get(`/api/exam-attempts/${attemptId}`);
    return response.data.data;
  },

  // Get all exam attempts with filters
  async getAttempts(filters: {
    page?: number;
    limit?: number;
    user?: string;
    exam?: string;
    status?: string;
    passed?: boolean;
    startedAfter?: string;
    startedBefore?: string;
    submittedAfter?: string;
    submittedBefore?: string;
  } = {}): Promise<{
    data: ExamAttempt[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/exam-attempts?${params.toString()}`);
    return response.data.data;
  },

  // Update exam attempt
  async updateAttempt(attemptId: string, data: Partial<ExamAttempt>): Promise<ExamAttempt> {
    const response = await api.put(`/api/exam-attempts/${attemptId}`, data);
    return response.data.data;
  },

  // Delete exam attempt
  async deleteAttempt(attemptId: string): Promise<void> {
    await api.delete(`/api/exam-attempts/${attemptId}`);
  },

  // Get attempts by user and exam
  async getAttemptsByUserAndExam(userId: string, examId: string): Promise<ExamAttempt[]> {
    const response = await api.get(`/api/exam-attempts/user/${userId}/exam/${examId}`);
    return response.data.data;
  },

  // Get attempts by status
  async getAttemptsByStatus(status: string): Promise<ExamAttempt[]> {
    const response = await api.get(`/api/exam-attempts/status/${status}`);
    return response.data.data;
  },

  // Get passed attempts
  async getPassedAttempts(): Promise<ExamAttempt[]> {
    const response = await api.get("/api/exam-attempts/passed/all");
    return response.data.data;
  },

  // Submit an individual answer
  async submitAnswer(attemptId: string, data: SubmitAnswerRequest): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/submit-answer`, data);
    return response.data.data;
  },

  // Submit the complete exam attempt
  async submitAttempt(attemptId: string): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/submit`);
    return response.data.data;
  },

  // Get attempt statistics
  async getAttemptStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    passed: number;
    averageScore: number;
    averageDuration: number;
  }> {
    const response = await api.get("/api/exam-attempts/stats/overview");
    return response.data.data;
  },

  // Get user statistics
  async getUserStats(userId: string): Promise<{
    totalAttempts: number;
    passedAttempts: number;
    avgScore: number;
    totalDuration: number;
    byExam: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const response = await api.get(`/api/exam-attempts/stats/user/${userId}`);
    return response.data.data;
  },

  // Check if user can create a new attempt
  async checkCanCreateAttempt(userId: string, examId: string): Promise<{
    canCreate: boolean;
    currentAttempts: number;
    maxAttempts: number;
    nextAttemptNumber: number;
    message: string;
  }> {
    const response = await api.get(`/api/exam-attempts/can-create/${userId}/${examId}`);
    return response.data.data;
  }
}; 