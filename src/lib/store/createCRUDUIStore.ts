import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CRUDUIState<T> {
  dialogOpen: boolean;
  deleteDialogOpen: boolean;
  selectedItem: T | null;
  itemToDelete: T | null;
  searchTerm: string;
  deleteLoading: boolean;
  setDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedItem: (item: T | null) => void;
  setItemToDelete: (item: T | null) => void;
  setSearchTerm: (term: string) => void;
  setDeleteLoading: (loading: boolean) => void;
  resetUI: () => void;
}

export function getCRUDInitialState<T>() {
  return {
    dialogOpen: false,
    deleteDialogOpen: false,
    selectedItem: null as T | null,
    itemToDelete: null as T | null,
    searchTerm: '',
    deleteLoading: false,
  };
}

export function crudActions<T>(set: (partial: any) => void) {
  return {
    setDialogOpen: (open: boolean) => set({ dialogOpen: open }),
    setDeleteDialogOpen: (open: boolean) => set({ deleteDialogOpen: open }),
    setSelectedItem: (item: T | null) => set({ selectedItem: item }),
    setItemToDelete: (item: T | null) => set({ itemToDelete: item }),
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    setDeleteLoading: (loading: boolean) => set({ deleteLoading: loading }),
  };
}

/** Creates a standalone CRUD UI store. Use for simple pages (no extra dialog/filter state). */
export function createCRUDUIStore<T>(storeName: string) {
  const initial = getCRUDInitialState<T>();
  return create<CRUDUIState<T>>()(
    devtools(
      (set) => ({
        ...initial,
        ...crudActions<T>(set),
        resetUI: () => set(initial),
      }),
      { name: storeName, enabled: process.env.NODE_ENV === 'development' }
    )
  );
}
