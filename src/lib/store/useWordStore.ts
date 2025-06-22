import { create } from "zustand";
import { wordService } from "../../services/wordService";
import { Word } from "../../models/Word";

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

  getWords: (page?: number, limit?: number, wordUser?: string) => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
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

  getWords: async (
    page = get().currentPage,
    limit = 7,
    wordUser = get().searchQuery
  ) => {
    set({
      loading: true,
      errors: null,
      currentPage: page,
      ...(page === 1 ? { words: [] } : {}),
    });
    try {
      const { data } = await wordService.getWords(page, limit, wordUser);

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
    get().getWords(1, 7, query);
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
        words: state.words.map((word) => (word._id === id ? data : word)),
        activeWord: data,
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
}));
