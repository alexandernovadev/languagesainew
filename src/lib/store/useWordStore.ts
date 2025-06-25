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

  getWords: (page?: number, limit?: number, filters?: Partial<WordFilters>) => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<WordFilters>) => void;
  retry: () => void;
  getWordById: (id: string) => Promise<void>;
  getWordByName: (word: string) => Promise<void>;
  createWord: (wordData: Omit<Word, "_id">) => Promise<void>;
  updateWord: (id: string, wordData: Partial<Word>) => Promise<void>;
  updateWordLevel: (id: string, level: string) => Promise<void>;
  incrementWordSeen: (id: string) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  getRecentHardOrMediumWords: () => Promise<void>;
  clearErrors: () => void;
  setActiveWord: (word: Word | null) => void;
  
  // AI Methods for updating word content
  updateWordExamples: (wordId: string, word: string, language: string, oldExamples: string[]) => Promise<void>;
  updateWordCodeSwitching: (wordId: string, word: string, language: string, oldExamples: string[]) => Promise<void>;
  updateWordSynonyms: (wordId: string, word: string, language: string, oldExamples: string[]) => Promise<void>;
  updateWordTypes: (wordId: string, word: string, language: string, oldExamples: string[]) => Promise<void>;
  updateWordImage: (wordId: string, word: string, imgOld?: string) => Promise<void>;
  generateWord: (prompt: string) => Promise<void>;
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
    } catch (error: any) {
      set({ errors: error.message, loading: false });
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
      set({ errors: error.message, loading: false });
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
        actionLoading: { ...state.actionLoading, create: false },
      }));
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, create: false },
      });
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, update: false },
      });
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
          word._id === id ? { ...word, level: data.level, updatedAt: data.updatedAt } : word
        ),
        activeWord: state.activeWord && state.activeWord._id === id
          ? { ...state.activeWord, level: data.level, updatedAt: data.updatedAt }
          : state.activeWord,
        actionLoading: { ...state.actionLoading, updateLevel: false },
      }));
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateLevel: false },
      });
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, incrementSeen: false },
      });
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, delete: false },
      });
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

  clearErrors: () => set({ errors: null }),

  // AI Methods for updating word content
  updateWordExamples: async (wordId: string, word: string, language: string, oldExamples: string[]) => {
    set({
      actionLoading: { ...get().actionLoading, updateExamples: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordExamples(wordId, word, language, oldExamples);
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateExamples: false },
      });
    }
  },

  updateWordCodeSwitching: async (wordId: string, word: string, language: string, oldExamples: string[]) => {
    set({
      actionLoading: { ...get().actionLoading, updateCodeSwitching: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordCodeSwitching(wordId, word, language, oldExamples);
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateCodeSwitching: false },
      });
    }
  },

  updateWordSynonyms: async (wordId: string, word: string, language: string, oldExamples: string[]) => {
    set({
      actionLoading: { ...get().actionLoading, updateSynonyms: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordSynonyms(wordId, word, language, oldExamples);
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateSynonyms: false },
      });
    }
  },

  updateWordTypes: async (wordId: string, word: string, language: string, oldExamples: string[]) => {
    set({
      actionLoading: { ...get().actionLoading, updateTypes: true },
      errors: null,
    });
    try {
      const { data } = await wordService.updateWordTypes(wordId, word, language, oldExamples);
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateTypes: false },
      });
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
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateImage: false },
      });
    }
  },

  generateWord: async (prompt: string) => {
    try {
      const { data } = await wordService.generateWordJSON(prompt);
      await get().createWord(data);
    } catch (error) {
      // Manejo de error opcional
      throw error;
    }
  },
}));
