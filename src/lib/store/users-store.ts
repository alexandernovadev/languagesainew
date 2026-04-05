import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/services/userService';

interface UsersUIState {
  dialogOpen: boolean;
  deleteDialogOpen: boolean;
  selectedUser: User | null;
  userToDelete: User | null;
  searchTerm: string;
  deleteLoading: boolean;

  setDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedUser: (user: User | null) => void;
  setUserToDelete: (user: User | null) => void;
  setSearchTerm: (term: string) => void;
  setDeleteLoading: (loading: boolean) => void;
  resetUI: () => void;
}

const initialState = {
  dialogOpen: false,
  deleteDialogOpen: false,
  selectedUser: null,
  userToDelete: null,
  searchTerm: '',
  deleteLoading: false,
};

export const useUsersUIStore = create<UsersUIState>()(
  devtools(
    (set) => ({
      ...initialState,
      setDialogOpen: (open) => set({ dialogOpen: open }),
      setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setUserToDelete: (user) => set({ userToDelete: user }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setDeleteLoading: (loading) => set({ deleteLoading: loading }),
      resetUI: () => set(initialState),
    }),
    { name: 'users-ui-store', enabled: process.env.NODE_ENV === 'development' }
  )
);
