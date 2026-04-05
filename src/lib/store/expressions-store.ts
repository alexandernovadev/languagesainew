import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { IExpression } from '@/types/models/Expression';
import { CRUDUIState, getCRUDInitialState, crudActions } from './createCRUDUIStore';

interface ExpressionsUIState extends CRUDUIState<IExpression> {
  filtersModalOpen: boolean;
  quickAddOpen: boolean;
  isGenerating: boolean;
  setFiltersModalOpen: (open: boolean) => void;
  setQuickAddOpen: (open: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
}

const initial = {
  ...getCRUDInitialState<IExpression>(),
  filtersModalOpen: false,
  quickAddOpen: false,
  isGenerating: false,
};

export const useExpressionsUIStore = create<ExpressionsUIState>()(
  devtools(
    (set) => ({
      ...initial,
      ...crudActions<IExpression>(set),
      setFiltersModalOpen: (open) => set({ filtersModalOpen: open }),
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      resetUI: () => set(initial),
    }),
    { name: 'expressions-ui-store', enabled: process.env.NODE_ENV === 'development' }
  )
);

// Selector hooks
export const useExpressionsDialogs = () =>
  useExpressionsUIStore(useShallow((state) => ({
    dialogOpen: state.dialogOpen,
    filtersModalOpen: state.filtersModalOpen,
    deleteDialogOpen: state.deleteDialogOpen,
    quickAddOpen: state.quickAddOpen,
  })));

export const useExpressionsSelection = () =>
  useExpressionsUIStore(useShallow((state) => ({
    selectedItem: state.selectedItem,
    itemToDelete: state.itemToDelete,
  })));

export const useExpressionsLoading = () =>
  useExpressionsUIStore(useShallow((state) => ({
    isGenerating: state.isGenerating,
    deleteLoading: state.deleteLoading,
  })));
