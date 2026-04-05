import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ILecture } from '@/types/models/Lecture';
import { CRUDUIState, getCRUDInitialState, crudActions } from './createCRUDUIStore';

interface LecturesUIState extends CRUDUIState<ILecture> {
  filtersModalOpen: boolean;
  setFiltersModalOpen: (open: boolean) => void;
}

const initial = {
  ...getCRUDInitialState<ILecture>(),
  filtersModalOpen: false,
};

export const useLecturesUIStore = create<LecturesUIState>()(
  devtools(
    (set) => ({
      ...initial,
      ...crudActions<ILecture>(set),
      setFiltersModalOpen: (open) => set({ filtersModalOpen: open }),
      resetUI: () => set(initial),
    }),
    { name: 'lectures-ui-store', enabled: process.env.NODE_ENV === 'development' }
  )
);
