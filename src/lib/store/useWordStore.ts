import { create } from "zustand";
import { wordService } from "../../services/wordService";
import { Word } from "../../models/Word";
import { WordFilters } from "@/components/forms/word-filters/types";

interface WordStore {
  words: Word[];
  activeWord: Word | null;
  loading: boolean;
  actionLoading: { [key: string]: boolean };
  errors: { [key: string]: string | null } | string | null;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  total: number;
  currentFilters: Partial<WordFilters>;

  getWords: (
    page?: number,
    limit?: number,
    filters?: Partial<WordFilters>
  ) => Promise<any>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<WordFilters>) => void;
  retry: () => void;
  getWordById: (id: string) => Promise<void>;
  getWordByName: (word: string) => Promise<void>;
  createWord: (wordData: Omit<Word, "_id">) => Promise<Word>;
  updateWord: (id: string, wordData: Partial<Word>) => Promise<Word>;
  updateWordLevel: (id: string, level: string) => Promise<any>;
  incrementWordSeen: (id: string) => Promise<boolean>;
  deleteWord: (id: string) => Promise<boolean>;
  getRecentHardOrMediumWords: () => Promise<void>;
  // Nuevos métodos para sistema de repaso inteligente
  getWordsForReview: (limit?: number) => Promise<void>;
  updateWordReview: (wordId: string, difficulty: number, quality: number) => Promise<any>;
  getReviewStats: () => Promise<any>;
  clearErrors: () => void;
  setActiveWord: (word: Word | null) => void;

  // AI Methods for updating word content
  updateWordExamples: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => Promise<Word>;
  updateWordCodeSwitching: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => Promise<Word>;
  updateWordSynonyms: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => Promise<Word>;
  updateWordTypes: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => Promise<Word>;
  updateWordImage: (
    wordId: string,
    word: string,
    imgOld?: string
  ) => Promise<Word>;
  generateWord: (prompt: string) => Promise<Word>;
}

export const useWordStore = create<WordStore>((set, get) => ({
  words: [],
  activeWord: null,
  loading: false,
  actionLoading: {},
  errors: null,
  totalPages: 1,
  currentPage: 1,
  searchQuery: "",
  total: 0,
  currentFilters: {},

  getWords: async (
    page = get().currentPage,
    limit = 6,
    filters = get().currentFilters
  ) => {
    set({
      loading: true,
      errors: null,
      currentPage: page,
      ...(page === 1 ? { words: [] } : {}),
    });
    try {
      // Combinar filtros con búsqueda de texto
      const combinedFilters = {
        ...filters,
        ...(get().searchQuery ? { wordUser: get().searchQuery } : {}),
      };

      const { data } = await wordService.getWords(page, limit, combinedFilters);

      set({
        words: data.data,
        totalPages: data.pages,
        total: data.total,
        loading: false,
      });
      return data;
    } catch (error: any) {
      console.log("🔍 Error al obtener palabras:", error);
      set({ errors: error.message, loading: false });
      throw error;
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().getWords(page);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().getWords(1, 6, get().currentFilters);
  },

  setFilters: (filters: Partial<WordFilters>) => {
    set({ currentFilters: filters, currentPage: 1 });
    get().getWords(1, 6, filters);
  },

  retry: () => {
    get().getWords();
  },

  setActiveWord: (word: Word | null) => {
    const currentActive = get().activeWord;
    if (currentActive?._id === word?._id) return;

    set({ activeWord: word });

    if (word?._id) {
      get().incrementWordSeen(word._id);
    }
  },

  getWordById: async (id: string) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await wordService.getWordById(id);
      set({ activeWord: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  getWordByName: async (word: string) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await wordService.getWordByName(word);
      set({ activeWord: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false, activeWord: null });
      throw error; // Lanzar el error para que el componente lo maneje
    }
  },

  createWord: async (wordData: Omit<Word, "_id">) => {
    set({
      actionLoading: { ...get().actionLoading, create: true },
      errors: null,
    });
    try {
      const { data } = await wordService.createWord(wordData);
      set((state) => ({
        words: [...state.words, data],
        activeWord: data,
        actionLoading: { ...state.actionLoading, create: false },
      }));
      return data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, create: false },
      });
      throw error;
    }
  },

  updateWord: async (id: string, wordData: Partial<Word>) => {
    set({
      actionLoading: { ...get().actionLoading, update: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWord(id, wordData);
      set((state) => ({
        words: state.words.map((word) => (word._id === id ? data : word)),
        activeWord: data,
        actionLoading: { ...state.actionLoading, update: false },
      }));
      return data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, update: false },
      });
      throw error;
    }
  },

  updateWordLevel: async (id: string, level: string) => {
    set({
      actionLoading: { ...get().actionLoading, updateLevel: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordLevel(id, level);
      set((state) => ({
        words: state.words.map((word) =>
          word._id === id
            ? { ...word, level: data.level, updatedAt: data.updatedAt }
            : word
        ),
        activeWord:
          state.activeWord && state.activeWord._id === id
            ? {
                ...state.activeWord,
                level: data.level,
                updatedAt: data.updatedAt,
              }
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateLevel: false },
      }));
      return data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateLevel: false },
      });
      throw error;
    }
  },

  incrementWordSeen: async (id: string) => {
    set({
      actionLoading: { ...get().actionLoading, incrementSeen: true },
      errors: null,
    });
    try {
      await wordService.incrementWordSeen(id);
      set((state) => ({
        words: state.words.map((word) =>
          word._id === id ? { ...word, seen: (word.seen || 0) + 1 } : word
        ),
        activeWord:
          state.activeWord && state.activeWord._id === id
            ? { ...state.activeWord, seen: (state.activeWord.seen || 0) + 1 }
            : state.activeWord,
        actionLoading: { ...state.actionLoading, incrementSeen: false },
      }));
      return true;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, incrementSeen: false },
      });
      throw error;
    }
  },

  deleteWord: async (id: string) => {
    set({
      actionLoading: { ...get().actionLoading, delete: true },
      errors: null,
    });
    try {
      await wordService.deleteWord(id);
      set((state) => ({
        words: state.words.filter((word) => word._id !== id),
        activeWord: state.activeWord?._id === id ? null : state.activeWord,
        actionLoading: { ...state.actionLoading, delete: false },
      }));
      return true;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, delete: false },
      });
      throw error;
    }
  },

  getRecentHardOrMediumWords: async () => {
    set({ loading: true, errors: null });
    try {
      const { data } = await wordService.getRecentHardOrMediumWords();
      set({ words: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  // Nuevos métodos para sistema de repaso inteligente
  getWordsForReview: async (limit?: number) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await wordService.getWordsForReview(limit);
      set({ words: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },
  updateWordReview: async (wordId: string, difficulty: number, quality: number) => {
    set({
      actionLoading: { ...get().actionLoading, updateReview: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordReview(wordId, difficulty, quality);
      set((state) => ({
        words: state.words.map((word) =>
          word._id === wordId ? { ...word, review: data.review, updatedAt: data.updatedAt } : word
        ),
        activeWord:
          state.activeWord && state.activeWord._id === wordId
            ? { ...state.activeWord, review: data.review, updatedAt: data.updatedAt }
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateReview: false },
      }));
      return data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateReview: false },
      });
      throw error;
    }
  },
  getReviewStats: async () => {
    set({ loading: true, errors: null });
    try {
      const { data } = await wordService.getReviewStats();
      set({ words: data, loading: false });
      return data;
    } catch (error: any) {
      set({ errors: error.message, loading: false });
      throw error;
    }
  },

  clearErrors: () => set({ errors: null }),

  // AI Methods for updating word content
  updateWordExamples: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => {
    set({
      actionLoading: { ...get().actionLoading, updateExamples: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordExamples(
        wordId,
        word,
        language,
        oldExamples
      );
      // Refresh the word data to get the updated content
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) =>
          w._id === wordId ? updatedWord.data : w
        ),
        activeWord:
          state.activeWord && state.activeWord._id === wordId
            ? updatedWord.data
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateExamples: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateExamples: false },
      });
      throw error;
    }
  },

  updateWordCodeSwitching: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => {
    set({
      actionLoading: { ...get().actionLoading, updateCodeSwitching: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordCodeSwitching(
        wordId,
        word,
        language,
        oldExamples
      );
      // Refresh the word data to get the updated content
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) =>
          w._id === wordId ? updatedWord.data : w
        ),
        activeWord:
          state.activeWord && state.activeWord._id === wordId
            ? updatedWord.data
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateCodeSwitching: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateCodeSwitching: false },
      });
      throw error;
    }
  },

  updateWordSynonyms: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => {
    set({
      actionLoading: { ...get().actionLoading, updateSynonyms: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordSynonyms(
        wordId,
        word,
        language,
        oldExamples
      );
      // Refresh the word data to get the updated content
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) =>
          w._id === wordId ? updatedWord.data : w
        ),
        activeWord:
          state.activeWord && state.activeWord._id === wordId
            ? updatedWord.data
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateSynonyms: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateSynonyms: false },
      });
      throw error;
    }
  },

  updateWordTypes: async (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string
  ) => {
    set({
      actionLoading: { ...get().actionLoading, updateTypes: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordTypes(
        wordId,
        word,
        language,
        oldExamples
      );
      // Refresh the word data to get the updated content
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) =>
          w._id === wordId ? updatedWord.data : w
        ),
        activeWord:
          state.activeWord && state.activeWord._id === wordId
            ? updatedWord.data
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateTypes: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateTypes: false },
      });
      throw error;
    }
  },

  updateWordImage: async (wordId: string, word: string, imgOld?: string) => {
    set({
      actionLoading: { ...get().actionLoading, updateImage: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordImage(wordId, word, imgOld);
      // Refresh the word data to get the updated content
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) =>
          w._id === wordId ? updatedWord.data : w
        ),
        activeWord:
          state.activeWord && state.activeWord._id === wordId
            ? updatedWord.data
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateImage: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateImage: false },
      });
      throw error;
    }
  },

  generateWord: async (prompt: string) => {
    try {
      console.log("Generando JSON para palabra:", prompt);
      const { data } = await wordService.generateWordJSON(prompt);
      console.log("JSON generado:", data);
      
      // El backend ya creó la palabra, solo necesitamos actualizar el estado
      set((state) => ({
        words: [...state.words, data],
        activeWord: data,
      }));
      
      console.log("Palabra creada exitosamente:", data);
      return data;
    } catch (error) {
      console.error("Error en generateWord:", error);
      throw error;
    }
  },
}));
