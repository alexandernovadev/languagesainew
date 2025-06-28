import { api } from './api';
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

export interface GetAttemptsParams {
  userId?: string;
  examId?: string;
  page?: number;
  limit?: number;
}

export const examAttemptService = {
  // Check if user can create a new attempt
  async checkCanCreateAttempt(userId: string, examId: string): Promise<CanCreateAttempt> {
    console.log("🌐 examAttemptService.checkCanCreateAttempt called", { userId, examId });
    
    const url = `/api/exam-attempts/user/${userId}/exam/${examId}/can-create`;
    console.log("📡 Making request to:", url);
    
    const response = await api.get(url);
    
    console.log("📥 Response received:", response.data);
    return response.data.data;
  },

  // Get paginated exam attempts
  async getAttempts(params: GetAttemptsParams): Promise<{ 
    data: ExamAttempt[]; 
    total: number; 
    page: number; 
    pages: number; 
  }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/api/exam-attempts?${queryParams.toString()}`);
    return response.data.data;
  },

  // Create a new exam attempt
  async createAttempt(data: CreateAttemptRequest): Promise<ExamAttempt> {
    console.log("🌐 examAttemptService.createAttempt called", data);
    
    console.log("📡 Making POST request to /api/exam-attempts");
    
    const response = await api.post('/api/exam-attempts', data);
    
    console.log("📥 Create attempt response:", response.data);
    return response.data.data;
  },

  // Submit an individual answer
  async submitAnswer(attemptId: string, data: SubmitAnswerRequest): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/submit-answer`, data);
    return response.data.data;
  },

  // Submit the exam attempt (finish)
  async submitAttempt(attemptId: string): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/submit`, {});
    return response.data.data;
  },

  // Grade the exam attempt (after AI evaluation)
  async gradeAttempt(attemptId: string, data: GradeAttemptRequest): Promise<ExamAttempt> {
    const response = await api.post(`/api/exam-attempts/${attemptId}/grade`, data);
    return response.data.data;
  },

  // Get evaluation status of an attempt
  async getEvaluationStatus(attemptId: string): Promise<{
    attemptId: string;
    status: string;
    evaluationStatus: {
      isComplete: boolean;
      requiresAI: boolean;
      totalAnswers: number;
      answersRequiringAI: number;
      autoEvaluatedAnswers: number;
    };
    answersRequiringAI: Array<{
      questionId: string;
      answer: any;
      feedback: string;
      type: string;
    }>;
    totalScore: number;
    accuracy: number;
  }> {
    const response = await api.get(`/api/exam-attempts/${attemptId}/evaluation-status`);
    return response.data.data;
  },

  // Get attempt history for a user and exam
  async getAttemptHistory(userId: string, examId: string): Promise<ExamAttempt[]> {
    const response = await api.get(`/api/exam-attempts/user/${userId}/exam/${examId}`);
    return response.data.data;
  },

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    const response = await api.get(`/api/exam-attempts/user/${userId}/stats`);
    return response.data.data;
  },

  // Get a specific attempt by ID
  async getAttempt(attemptId: string): Promise<ExamAttempt> {
    const response = await api.get(`/api/exam-attempts/${attemptId}`);
    return response.data.data;
  }
}; 