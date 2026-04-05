import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ILecture } from '@/types/models/Lecture';

interface LectureFilters {
  search?: string;
  language?: string;
  difficulty?: string[];
  type?: string;
  [key: string]: any;
}

interface LecturesUIState {
  // Dialog states
  dialogOpen: boolean;
  filtersModalOpen: boolean;
  deleteDialogOpen: boolean;

  // Selection
  selectedLecture: ILecture | null;
  lectureToDelete: ILecture | null;

  // Search & filters
  searchTerm: string;
  filters: Partial<LectureFilters>;

  // Loading
  deleteLoading: boolean;

  // Actions
  setDialogOpen: (open: boolean) => void;
  setFiltersModalOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedLecture: (lecture: ILecture | null) => void;
  setLectureToDelete: (lecture: ILecture | null) => void;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
  setDeleteLoading: (loading: boolean) => void;
  resetUI: () => void;
}

const initialState = {
  dialogOpen: false,
  filtersModalOpen: false,
  deleteDialogOpen: false,
  selectedLecture: null,
  lectureToDelete: null,
  searchTerm: '',
  filters: {},
  deleteLoading: false,
};

export const useLecturesUIStore = create<LecturesUIState>()(
  devtools(
    (set) => ({
      ...initialState,

      setDialogOpen: (open) => set({ dialogOpen: open }),
      setFiltersModalOpen: (open) => set({ filtersModalOpen: open }),
      setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
      setSelectedLecture: (lecture) => set({ selectedLecture: lecture }),
      setLectureToDelete: (lecture) => set({ lectureToDelete: lecture }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      clearFilters: () => set({ searchTerm: '', filters: {} }),
      setDeleteLoading: (loading) => set({ deleteLoading: loading }),
      resetUI: () => set(initialState),
    }),
    {
      name: 'lectures-ui-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
