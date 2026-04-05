/**
 * Expressions UI Store - Zustand
 * 
 * Manages all Expressions page UI state
 * (Same pattern as Words store)
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { IExpression } from '@/types/models/Expression';

interface ExpressionFilters {
  search?: string;
  language?: string;
  type?: string[];
  context?: string;
  [key: string]: any;
}

interface ExpressionsUIState {
  // Dialog states
  dialogOpen: boolean;
  filtersModalOpen: boolean;
  deleteDialogOpen: boolean;
  quickAddOpen: boolean;

  // Selection
  selectedExpression: IExpression | null;
  expressionToDelete: IExpression | null;

  // Search & filters
  searchTerm: string;
  filters: Partial<ExpressionFilters>;

  // Pagination
  currentPage: number;
  totalPages: number;

  // Loading
  isLoading: boolean;
  isGenerating: boolean;
  deleteLoading: boolean;

  // Actions
  setDialogOpen: (open: boolean) => void;
  setFiltersModalOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setQuickAddOpen: (open: boolean) => void;
  setSelectedExpression: (expr: IExpression | null) => void;
  setExpressionToDelete: (expr: IExpression | null) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<ExpressionFilters>) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setDeleteLoading: (loading: boolean) => void;
  resetUI: () => void;
}

const initialState = {
  dialogOpen: false,
  filtersModalOpen: false,
  deleteDialogOpen: false,
  quickAddOpen: false,
  selectedExpression: null,
  expressionToDelete: null,
  searchTerm: '',
  filters: {},
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isGenerating: false,
  deleteLoading: false,
};

export const useExpressionsUIStore = create<ExpressionsUIState>()(
  devtools(
    (set) => ({
      ...initialState,

      setDialogOpen: (open) => set({ dialogOpen: open }),
      setFiltersModalOpen: (open) => set({ filtersModalOpen: open }),
      setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),

      setSelectedExpression: (expr) => set({ selectedExpression: expr }),
      setExpressionToDelete: (expr) => set({ expressionToDelete: expr }),

      setSearchTerm: (term) => set({ searchTerm: term }),
      setFilters: (filters) =>
        set({ filters, currentPage: 1 }),
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          currentPage: 1,
        })),
      clearFilters: () =>
        set({ filters: {}, searchTerm: '', currentPage: 1 }),

      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (pages) => set({ totalPages: pages }),

      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setDeleteLoading: (loading) => set({ deleteLoading: loading }),

      resetUI: () => set(initialState),
    }),
    {
      name: 'expressions-ui-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Selector hooks for optimized re-renders
export const useExpressionsDialogs = () =>
  useExpressionsUIStore(useShallow((state) => ({
    dialogOpen: state.dialogOpen,
    filtersModalOpen: state.filtersModalOpen,
    deleteDialogOpen: state.deleteDialogOpen,
    quickAddOpen: state.quickAddOpen,
  })));

export const useExpressionsSelection = () =>
  useExpressionsUIStore(useShallow((state) => ({
    selectedExpression: state.selectedExpression,
    expressionToDelete: state.expressionToDelete,
  })));

export const useExpressionsFilters = () =>
  useExpressionsUIStore(useShallow((state) => ({
    searchTerm: state.searchTerm,
    filters: state.filters,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
  })));

export const useExpressionsLoading = () =>
  useExpressionsUIStore(useShallow((state) => ({
    isLoading: state.isLoading,
    isGenerating: state.isGenerating,
    deleteLoading: state.deleteLoading,
  })));
