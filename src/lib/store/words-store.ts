/**
 * Words UI Store - Zustand
 * 
 * Manages all Words page UI state:
 * - Dialog/modal states
 * - Selected word
 * - Filters & pagination
 * - Loading states
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { Word } from '@/models/Word';

interface WordFilters {
  search?: string;
  language?: string;
  type?: string;
  difficulty?: string[];
  wordUser?: string;
  [key: string]: any;
}

interface WordsUIState {
  // ========== Dialog States ==========
  dialogOpen: boolean;
  detailModalOpen: boolean;
  filtersModalOpen: boolean;
  deleteDialogOpen: boolean;
  quickAddOpen: boolean;

  // ========== Selection State ==========
  selectedWord: Word | null;
  wordToDelete: Word | null;
  selectedWordId: string | null;

  // ========== Search & Filters ==========
  searchTerm: string;
  filters: Partial<WordFilters>;

  // ========== Pagination ==========
  currentPage: number;
  totalPages: number;

  // ========== Loading States ==========
  isLoading: boolean;
  isGenerating: boolean;
  deleteLoading: boolean;

  // ========== Actions ==========
  // Dialog actions
  setDialogOpen: (open: boolean) => void;
  setDetailModalOpen: (open: boolean) => void;
  setFiltersModalOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setQuickAddOpen: (open: boolean) => void;

  // Selection actions
  setSelectedWord: (word: Word | null) => void;
  setWordToDelete: (word: Word | null) => void;
  setSelectedWordId: (id: string | null) => void;

  // Search & filter actions
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<WordFilters>) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;

  // Loading actions
  setIsLoading: (loading: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setDeleteLoading: (loading: boolean) => void;

  // Utility action - reset all state
  resetUI: () => void;
}

const initialState = {
  dialogOpen: false,
  detailModalOpen: false,
  filtersModalOpen: false,
  deleteDialogOpen: false,
  quickAddOpen: false,
  selectedWord: null,
  wordToDelete: null,
  selectedWordId: null,
  searchTerm: '',
  filters: {},
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isGenerating: false,
  deleteLoading: false,
};

/**
 * Zustand store for Words page UI state
 * Automatically synced to localStorage via persist middleware (optional)
 */
export const useWordsUIStore = create<WordsUIState>()(
  devtools(
    (set) => ({
      ...initialState,

      // Dialog actions
      setDialogOpen: (open) => set({ dialogOpen: open }),
      setDetailModalOpen: (open) => set({ detailModalOpen: open }),
      setFiltersModalOpen: (open) => set({ filtersModalOpen: open }),
      setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),

      // Selection actions
      setSelectedWord: (word) => set({ selectedWord: word }),
      setWordToDelete: (word) => set({ wordToDelete: word }),
      setSelectedWordId: (id) => set({ selectedWordId: id }),

      // Search & filter actions
      setSearchTerm: (term) => set({ searchTerm: term }),
      setFilters: (filters) =>
        set({ filters, currentPage: 1 }), // Reset to page 1 when filters change
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          currentPage: 1, // Reset to page 1
        })),
      clearFilters: () =>
        set({ filters: {}, searchTerm: '', currentPage: 1 }),

      // Pagination actions
      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (pages) => set({ totalPages: pages }),

      // Loading actions
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setDeleteLoading: (loading) => set({ deleteLoading: loading }),

      // Reset everything
      resetUI: () => set(initialState),
    }),
    {
      name: 'words-ui-store', // localStorage key
      enabled: process.env.NODE_ENV === 'development', // Devtools only in dev
    }
  )
);

/**
 * Custom selector hooks for optimized re-renders
 * Use these to subscribe to specific parts of state only
 */

// Dialog states
export const useWordsDialogs = () =>
  useWordsUIStore(useShallow((state) => ({
    dialogOpen: state.dialogOpen,
    detailModalOpen: state.detailModalOpen,
    filtersModalOpen: state.filtersModalOpen,
    deleteDialogOpen: state.deleteDialogOpen,
    quickAddOpen: state.quickAddOpen,
  })));

// Selection state
export const useWordsSelection = () =>
  useWordsUIStore(useShallow((state) => ({
    selectedWord: state.selectedWord,
    wordToDelete: state.wordToDelete,
    selectedWordId: state.selectedWordId,
  })));

// Filters & search
export const useWordsFilters = () =>
  useWordsUIStore(useShallow((state) => ({
    searchTerm: state.searchTerm,
    filters: state.filters,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
  })));

// Loading states
export const useWordsLoading = () =>
  useWordsUIStore(useShallow((state) => ({
    isLoading: state.isLoading,
    isGenerating: state.isGenerating,
    deleteLoading: state.deleteLoading,
  })));
