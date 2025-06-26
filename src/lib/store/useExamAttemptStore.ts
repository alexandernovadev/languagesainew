import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types based on backend documentation
export interface ExamAttempt {
  _id: string;
  user: string;
  exam: string;
  attemptNumber: number;
  status: 'in_progress' | 'submitted' | 'graded';
  startedAt: Date;
  submittedAt?: Date;
  duration?: number;
  passed?: boolean;
  cefrEstimated?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  aiEvaluation?: {
    grammar?: number;
    fluency?: number;
    coherence?: number;
    vocabulary?: number;
    comments?: string;
  };
  aiNotes?: string;
  answers: Array<{
    question: string;
    answer: any;
    isCorrect?: boolean;
    score?: number;
    feedback?: string;
    submittedAt: Date;
  }>;
}

export interface CanCreateAttempt {
  canCreate: boolean;
  currentAttempts: number;
  maxAttempts: number;
  nextAttemptNumber: number;
  message?: string;
}

export interface UserStats {
  totalAttempts: number;
  passedAttempts: number;
  avgScore: number;
  totalDuration: number;
  byExam: Record<string, number>;
  byStatus: Record<string, number>;
}

interface ExamAttemptStore {
  // Current attempt state
  currentAttempt: ExamAttempt | null;
  currentExamId: string | null;
  currentQuestionIndex: number;
  
  // Answers state
  answers: Record<string, any>; // questionId -> answer
  answeredQuestions: Set<string>;
  
  // UI state
  isStarting: boolean;
  isSubmitting: boolean;
  isFinishing: boolean;
  error: string | null;
  
  // Timer state
  timeRemaining: number; // in seconds
  isTimerRunning: boolean;
  
  // Actions
  setCurrentAttempt: (attempt: ExamAttempt | null) => void;
  setCurrentExamId: (examId: string | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  
  // Answer management
  setAnswer: (questionId: string, answer: any) => void;
  getAnswer: (questionId: string) => any;
  isQuestionAnswered: (questionId: string) => boolean;
  getAnsweredCount: () => number;
  
  // Timer management
  setTimeRemaining: (seconds: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  updateTimer: () => void;
  
  // Loading states
  setStarting: (loading: boolean) => void;
  setSubmitting: (loading: boolean) => void;
  setFinishing: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  resetAttempt: () => void;
  resetAnswers: () => void;
}

export const useExamAttemptStore = create<ExamAttemptStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentAttempt: null,
      currentExamId: null,
      currentQuestionIndex: 0,
      answers: {},
      answeredQuestions: new Set(),
      isStarting: false,
      isSubmitting: false,
      isFinishing: false,
      error: null,
      timeRemaining: 0,
      isTimerRunning: false,

      // Actions
      setCurrentAttempt: (attempt) => set({ currentAttempt: attempt }),
      setCurrentExamId: (examId) => set({ currentExamId: examId }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      // Answer management
      setAnswer: (questionId, answer) => set((state) => {
        const newAnswers = { ...state.answers, [questionId]: answer };
        const newAnsweredQuestions = new Set(state.answeredQuestions);
        
        if (answer !== null && answer !== undefined && answer !== '') {
          newAnsweredQuestions.add(questionId);
        } else {
          newAnsweredQuestions.delete(questionId);
        }

        return {
          answers: newAnswers,
          answeredQuestions: newAnsweredQuestions
        };
      }),

      getAnswer: (questionId) => get().answers[questionId],
      
      isQuestionAnswered: (questionId) => get().answeredQuestions.has(questionId),
      
      getAnsweredCount: () => get().answeredQuestions.size,

      // Timer management
      setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),
      
      startTimer: () => set({ isTimerRunning: true }),
      
      stopTimer: () => set({ isTimerRunning: false }),
      
      updateTimer: () => set((state) => {
        if (state.isTimerRunning && state.timeRemaining > 0) {
          return { timeRemaining: state.timeRemaining - 1 };
        }
        return state;
      }),

      // Loading states
      setStarting: (loading) => set({ isStarting: loading }),
      setSubmitting: (loading) => set({ isSubmitting: loading }),
      setFinishing: (loading) => set({ isFinishing: loading }),
      setError: (error) => set({ error }),

      // Reset
      resetAttempt: () => set({
        currentAttempt: null,
        currentExamId: null,
        currentQuestionIndex: 0,
        answers: {},
        answeredQuestions: new Set(),
        isStarting: false,
        isSubmitting: false,
        isFinishing: false,
        error: null,
        timeRemaining: 0,
        isTimerRunning: false
      }),

      resetAnswers: () => set({
        answers: {},
        answeredQuestions: new Set()
      })
    }),
    {
      name: 'exam-attempt-storage',
      partialize: (state) => ({
        answers: state.answers,
        answeredQuestions: Array.from(state.answeredQuestions),
        currentQuestionIndex: state.currentQuestionIndex,
        timeRemaining: state.timeRemaining
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert array back to Set
          state.answeredQuestions = new Set(state.answeredQuestions);
        }
      }
    }
  )
); 