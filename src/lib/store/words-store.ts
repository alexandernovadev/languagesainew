import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { IWord as Word } from '@/types/models/Word';
import { CRUDUIState, getCRUDInitialState, crudActions } from './createCRUDUIStore';

interface WordsUIState extends CRUDUIState<Word> {
  filtersModalOpen: boolean;
  detailModalOpen: boolean;
  quickAddOpen: boolean;
  selectedWordId: string | null;
  isGenerating: boolean;
  setFiltersModalOpen: (open: boolean) => void;
  setDetailModalOpen: (open: boolean) => void;
  setQuickAddOpen: (open: boolean) => void;
  setSelectedWordId: (id: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
}

const initial = {
  ...getCRUDInitialState<Word>(),
  filtersModalOpen: false,
  detailModalOpen: false,
  quickAddOpen: false,
  selectedWordId: null as string | null,
  isGenerating: false,
};

export const useWordsUIStore = create<WordsUIState>()(
  devtools(
    (set) => ({
      ...initial,
      ...crudActions<Word>(set),
      setFiltersModalOpen: (open) => set({ filtersModalOpen: open }),
      setDetailModalOpen: (open) => set({ detailModalOpen: open }),
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),
      setSelectedWordId: (id) => set({ selectedWordId: id }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      resetUI: () => set(initial),
    }),
    { name: 'words-ui-store', enabled: process.env.NODE_ENV === 'development' }
  )
);

// Selector hooks
export const useWordsDialogs = () =>
  useWordsUIStore(useShallow((state) => ({
    dialogOpen: state.dialogOpen,
    detailModalOpen: state.detailModalOpen,
    filtersModalOpen: state.filtersModalOpen,
    deleteDialogOpen: state.deleteDialogOpen,
    quickAddOpen: state.quickAddOpen,
  })));

export const useWordsSelection = () =>
  useWordsUIStore(useShallow((state) => ({
    selectedItem: state.selectedItem,
    itemToDelete: state.itemToDelete,
    selectedWordId: state.selectedWordId,
  })));

export const useWordsLoading = () =>
  useWordsUIStore(useShallow((state) => ({
    isGenerating: state.isGenerating,
    deleteLoading: state.deleteLoading,
  })));
