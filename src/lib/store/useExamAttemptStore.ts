import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  // State
  currentAttempt: ExamAttempt | null;
  currentExamId: string | null;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  answeredQuestions: Set<string>;
  isStarting: boolean;
  isSubmitting: boolean;
  isFinishing: boolean;
  error: string | null;
  timeRemaining: number;
  isTimerRunning: boolean;

  // Actions
  setCurrentAttempt: (attempt: ExamAttempt | null) => void;
  setCurrentExamId: (examId: string | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: any) => void;
  getAnswer: (questionId: string) => any;
  isQuestionAnswered: (questionId: string) => boolean;
  getAnsweredCount: () => number;
  setTimeRemaining: (seconds: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  updateTimer: () => void;
  setStarting: (loading: boolean) => void;
  setSubmitting: (loading: boolean) => void;
  setFinishing: (loading: boolean) => void;
  setError: (error: string | null) => void;
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