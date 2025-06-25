import { create } from "zustand";
import { questionService } from "../../services/questionService";
import { Question, QuestionInput, QuestionFilters, QuestionStats } from "../../models/Question";

interface QuestionStore {
  questions: Question[];
  activeQuestion: Question | null;
  loading: boolean;
  actionLoading: { [key: string]: boolean };
  errors: { [key: string]: string | null } | string | null;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  total: number;
  currentFilters: Partial<QuestionFilters>;
  stats: QuestionStats | null;

  getQuestions: (page?: number, limit?: number, filters?: Partial<QuestionFilters>) => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<QuestionFilters>) => void;
  retry: () => void;
  getQuestionById: (id: string) => Promise<void>;
  createQuestion: (questionData: QuestionInput) => Promise<void>;
  updateQuestion: (id: string, questionData: Partial<QuestionInput>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  getQuestionStats: () => Promise<void>;
  getQuestionsByLevel: (level: string, limit?: number) => Promise<void>;
  getQuestionsByLevelAndType: (level: string, type: string) => Promise<void>;
  getQuestionsByTopic: (topic: string) => Promise<void>;
  getQuestionsByTags: (tags: string) => Promise<void>;
  getRandomQuestions: (level: string, type: string, limit?: number) => Promise<void>;
  clearErrors: () => void;
  setActiveQuestion: (question: Question | null) => void;
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  questions: [],
  activeQuestion: null,
  loading: false,
  actionLoading: {},
  errors: null,
  totalPages: 1,
  currentPage: 1,
  searchQuery: "",
  total: 0,
  currentFilters: {},
  stats: null,

  getQuestions: async (
    page = get().currentPage,
    limit = 10,
    filters = get().currentFilters
  ) => {
    set({
      loading: true,
      errors: null,
      currentPage: page,
      ...(page === 1 ? { questions: [] } : {}),
    });
    try {
      // Combinar filtros con búsqueda de texto
      const combinedFilters = {
        ...filters,
        ...(get().searchQuery ? { topic: get().searchQuery } : {}),
      };

      const { data } = await questionService.getQuestions(page, limit, combinedFilters);

      set({
        questions: data.data,
        totalPages: data.pages,
        total: data.total,
        loading: false,
      });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().getQuestions(page);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().getQuestions(1, 10, get().currentFilters);
  },

  setFilters: (filters: Partial<QuestionFilters>) => {
    set({ currentFilters: filters, currentPage: 1 });
    // No llamar getQuestions aquí, se llamará desde el componente
  },

  retry: () => {
    get().getQuestions();
  },

  setActiveQuestion: (question: Question | null) => {
    const currentActive = get().activeQuestion;
    if (currentActive?._id === question?._id) return;
    set({ activeQuestion: question });
  },

  getQuestionById: async (id: string) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await questionService.getQuestionById(id);
      set({ activeQuestion: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  createQuestion: async (questionData: QuestionInput) => {
    set({
      actionLoading: { ...get().actionLoading, create: true },
      errors: null,
    });
    try {
      const { data } = await questionService.createQuestion(questionData);
      set((state) => ({
        questions: [...state.questions, data],
        actionLoading: { ...state.actionLoading, create: false },
      }));
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, create: false },
      });
    }
  },

  updateQuestion: async (id: string, questionData: Partial<QuestionInput>) => {
    set({
      actionLoading: { ...get().actionLoading, update: true },
      errors: null,
    });
    try {
      const { data } = await questionService.updateQuestion(id, questionData);
      set((state) => ({
        questions: state.questions.map((question) => (question._id === id ? data : question)),
        activeQuestion: data,
        actionLoading: { ...state.actionLoading, update: false },
      }));
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, update: false },
      });
    }
  },

  deleteQuestion: async (id: string) => {
    set({
      actionLoading: { ...get().actionLoading, delete: true },
      errors: null,
    });
    try {
      await questionService.deleteQuestion(id);
      set((state) => ({
        questions: state.questions.filter((question) => question._id !== id),
        activeQuestion: state.activeQuestion?._id === id ? null : state.activeQuestion,
        actionLoading: { ...state.actionLoading, delete: false },
      }));
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, delete: false },
      });
    }
  },

  getQuestionStats: async () => {
    set({ loading: true, errors: null });
    try {
      const { data } = await questionService.getQuestionStats();
      set({ stats: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  getQuestionsByLevel: async (level: string, limit = 10) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await questionService.getQuestionsByLevel(level, limit);
      set({ questions: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  getQuestionsByLevelAndType: async (level: string, type: string) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await questionService.getQuestionsByLevelAndType(level, type);
      set({ questions: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  getQuestionsByTopic: async (topic: string) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await questionService.getQuestionsByTopic(topic);
      set({ questions: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  getQuestionsByTags: async (tags: string) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await questionService.getQuestionsByTags(tags);
      set({ questions: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  getRandomQuestions: async (level: string, type: string, limit = 5) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await questionService.getRandomQuestions(level, type, limit);
      set({ questions: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  clearErrors: () => {
    set({ errors: null });
  },
})); 