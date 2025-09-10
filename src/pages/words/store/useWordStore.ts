import { create } from "zustand";
import { wordService } from "../../services/wordService";
import { Word } from "../../models/Word";
import type { ChatMessage } from "../../models/Word";
import { WordFilters } from "@/components/forms/word-filters/types";
import { toast } from "sonner";

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
  clearFilters: () => void;
  retry: () => void;
  getWordById: (id: string) => Promise<void>;
  getWordByName: (word: string) => Promise<void>;
  createWord: (wordData: Omit<Word, "_id">) => Promise<Word>;
  updateWord: (id: string, wordData: Partial<Word>) => Promise<Word>;
  updateWordDifficulty: (id: string, difficulty: string) => Promise<any>;
  incrementWordSeen: (id: string) => Promise<boolean>;
  deleteWord: (id: string) => Promise<boolean>;
  getAnkiCards: (options?: {
    mode?: 'random' | 'review';
    limit?: number;
    difficulty?: string[];
  }) => Promise<void>;
  clearErrors: () => void;
  setActiveWord: (word: Word | null) => void;

  // AI Methods for updating word content
  updateWordExamples: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<Word>;
  updateWordCodeSwitching: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<Word>;
  updateWordSynonyms: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<Word>;
  updateWordTypes: (
    wordId: string,
    word: string,
    language: string,
    oldExamples: string[]
  ) => Promise<Word>;
  updateWordImage: (
    wordId: string,
    word: string,
    imgOld?: string
  ) => Promise<Word>;
  generateWord: (word: string, language?: string, provider?: string) => Promise<Word>;

  // Chat actions
  addChatMessage: (wordId: string, message: string) => Promise<void>;
  streamChatMessage: (
    wordId: string,
    message: string,
    onChunk?: (chunk: string) => void
  ) => Promise<void>;
  getChatHistory: (wordId: string) => Promise<ChatMessage[]>;
  clearChatHistory: (wordId: string) => Promise<void>;
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
    limit = 8,
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
    // Cuando hay búsqueda, usar solo el filtro de búsqueda, ignorando otros filtros
    const filtersToUse = query ? { wordUser: query } : get().currentFilters;
    get().getWords(1, 8, filtersToUse);
  },

  setFilters: (filters: Partial<WordFilters>) => {
    set({ currentFilters: filters, currentPage: 1 });
    get().getWords(1, 8, filters);
  },

  clearFilters: () => {
    set({ currentFilters: {}, currentPage: 1 });
    // Mantener la búsqueda actual si existe
    const filtersToUse = get().searchQuery
      ? { wordUser: get().searchQuery }
      : {};
    get().getWords(1, 8, filtersToUse);
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

  updateWordDifficulty: async (id: string, difficulty: string) => {
    set({ actionLoading: { ...get().actionLoading, updateDifficulty: true }, errors: null });
    try {
      const { data } = await wordService.updateWordDifficulty(id, difficulty);
      set((state) => ({
        words: state.words.map((word) =>
          word._id === id ? { ...word, difficulty: data.difficulty, updatedAt: data.updatedAt } : word
        ),
        activeWord:
          state.activeWord && state.activeWord._id === id
            ? { ...state.activeWord, difficulty: data.difficulty, updatedAt: data.updatedAt }
            : state.activeWord,
        actionLoading: { ...state.actionLoading, updateDifficulty: false },
      }));
      return data;
    } catch (error: any) {
      set({
        errors: error.message,
        actionLoading: { ...get().actionLoading, updateDifficulty: false },
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


  // Método unificado para tarjetas Anki
  getAnkiCards: async (options: {
    mode?: 'random' | 'review';
    limit?: number;
    difficulty?: string[];
  } = {}) => {
    set({ loading: true, errors: null });
    try {
      const { data } = await wordService.getAnkiCards(options);
      set({ words: data, loading: false });
    } catch (error: any) {
      set({ errors: error.message, loading: false });
    }
  },

  clearErrors: () => set({ errors: null }),

  // AI Methods for updating word content
  updateWordExamples: async (wordId, word, language, oldExamples) => {
    set({ actionLoading: { ...get().actionLoading, updateExamples: true }, errors: null });
    try {
      const { data } = await wordService.generateWordExamples(wordId, word, language, oldExamples);
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) => (w._id === wordId ? updatedWord.data : w)),
        activeWord: state.activeWord && state.activeWord._id === wordId ? updatedWord.data : state.activeWord,
        actionLoading: { ...state.actionLoading, updateExamples: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({ errors: error.message, actionLoading: { ...get().actionLoading, updateExamples: false } });
      throw error;
    }
  },
  updateWordCodeSwitching: async (wordId, word, language, oldExamples) => {
    set({ actionLoading: { ...get().actionLoading, updateCodeSwitching: true }, errors: null });
    try {
      const { data } = await wordService.generateWordCodeSwitching(wordId, word, language, oldExamples);
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) => (w._id === wordId ? updatedWord.data : w)),
        activeWord: state.activeWord && state.activeWord._id === wordId ? updatedWord.data : state.activeWord,
        actionLoading: { ...state.actionLoading, updateCodeSwitching: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({ errors: error.message, actionLoading: { ...get().actionLoading, updateCodeSwitching: false } });
      throw error;
    }
  },
  updateWordSynonyms: async (wordId, word, language, oldExamples) => {
    set({ actionLoading: { ...get().actionLoading, updateSynonyms: true }, errors: null });
    try {
      const { data } = await wordService.generateWordSynonyms(wordId, word, language, oldExamples);
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) => (w._id === wordId ? updatedWord.data : w)),
        activeWord: state.activeWord && state.activeWord._id === wordId ? updatedWord.data : state.activeWord,
        actionLoading: { ...state.actionLoading, updateSynonyms: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({ errors: error.message, actionLoading: { ...get().actionLoading, updateSynonyms: false } });
      throw error;
    }
  },
  updateWordTypes: async (wordId, word, language, oldExamples) => {
    set({ actionLoading: { ...get().actionLoading, updateTypes: true }, errors: null });
    try {
      const { data } = await wordService.generateWordTypes(wordId, word, language, oldExamples);
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) => (w._id === wordId ? updatedWord.data : w)),
        activeWord: state.activeWord && state.activeWord._id === wordId ? updatedWord.data : state.activeWord,
        actionLoading: { ...state.actionLoading, updateTypes: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({ errors: error.message, actionLoading: { ...get().actionLoading, updateTypes: false } });
      throw error;
    }
  },
  updateWordImage: async (wordId, word, imgOld) => {
    set({ actionLoading: { ...get().actionLoading, updateImage: true }, errors: null });
    try {
      const { data } = await wordService.generateWordImage(wordId, word, imgOld);
      const updatedWord = await wordService.getWordById(wordId);
      set((state) => ({
        words: state.words.map((w) => (w._id === wordId ? updatedWord.data : w)),
        activeWord: state.activeWord && state.activeWord._id === wordId ? updatedWord.data : state.activeWord,
        actionLoading: { ...state.actionLoading, updateImage: false },
      }));
      return updatedWord.data;
    } catch (error: any) {
      set({ errors: error.message, actionLoading: { ...get().actionLoading, updateImage: false } });
      throw error;
    }
  },
  generateWord: async (word, language = "en", provider = "openai") => {
    try {
      const { data } = await wordService.generateWord(word, language, provider);
      set((state) => ({
        words: [...state.words, data],
        activeWord: data,
      }));
      return data;
    } catch (error) {
      console.error("Error en generateWord:", error);
      throw error;
    }
  },

  addChatMessage: async (wordId, message) => {
    try {
      const response = await wordService.addChatMessage(wordId, message);
      set({
        words: get().words.map((word) =>
          word._id === wordId ? response.data.word : word
        ),
      });
    } catch (error: any) {
      console.error("Error adding chat message:", error);
      toast.error("Error al enviar el mensaje");
    }
  },

  streamChatMessage: async (wordId, message, onChunk) => {
    try {
      const stream = await wordService.streamChatMessage(wordId, message);

      if (!stream) {
        throw new Error("No stream received");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        if (onChunk) {
          onChunk(chunk);
        }
      }
    } catch (error: any) {
      console.error("Error streaming chat message:", error);
      toast.error("Error al enviar el mensaje");
      throw error;
    }
  },

  getChatHistory: async (wordId) => {
    try {
      const response = await wordService.getChatHistory(wordId);
      return response.data?.data || response.data || [];
    } catch (error: any) {
      console.error("Error getting chat history:", error);
      toast.error("Error al cargar el historial del chat");
      return [];
    }
  },

  clearChatHistory: async (wordId) => {
    try {
      await wordService.clearChatHistory(wordId);
      set({
        words: get().words.map((word) =>
          word._id === wordId ? { ...word, chat: [] } : word
        ),
      });
      toast.success("Chat limpiado exitosamente");
    } catch (error: any) {
      console.error("Error clearing chat history:", error);
      toast.error("Error al limpiar el chat");
    }
  },
}));
