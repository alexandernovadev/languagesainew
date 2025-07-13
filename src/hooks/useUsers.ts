import { useState, useEffect, useCallback } from 'react';
import { userService, User, UserCreate, UserUpdate, UserFilters, UsersResponse } from '@/services/userService';
import { toast } from 'sonner';

export const useUsers = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Modal states
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(filters);
      setUsers(response.data || []);
      setPagination({
        currentPage: response.page || 1,
        totalPages: response.pages || 1,
        totalItems: response.total || 0,
        itemsPerPage: filters.limit || 10,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
      setUsers([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: filters.limit || 10,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search
  const handleSearch = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      username: searchTerm || undefined,
      page: 1,
    }));
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    setIsFiltersModalOpen(false);
    fetchUsers();
  }, [fetchUsers]);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchTerm('');
  }, []);

  // Pagination
  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  }, []);

  // Create user
  const createUser = useCallback(async (userData: UserCreate) => {
    setSaving(true);
    try {
      await userService.createUser(userData);
      toast.success('Usuario creado exitosamente');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  }, [fetchUsers]);

  // Update user
  const updateUser = useCallback(async (id: string, userData: UserUpdate) => {
    setSaving(true);
    try {
      await userService.updateUser(id, userData);
      toast.success('Usuario actualizado exitosamente');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar usuario');
    } finally {
      setSaving(false);
    }
  }, [fetchUsers]);

  // Delete user
  const deleteUser = useCallback(async (id: string) => {
    setSaving(true);
    try {
      await userService.deleteUser(id);
      toast.success('Usuario eliminado exitosamente');
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar usuario');
    } finally {
      setSaving(false);
    }
  }, [fetchUsers]);

  // Handle edit user
  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }, []);

  // Handle delete user
  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }, []);

  // Check if there are active filters
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof UserFilters];
    return value !== undefined && value !== null && value !== '' && key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder';
  });

  return {
    // State
    users,
    loading,
    saving,
    pagination,
    filters,
    searchTerm,
    selectedUser,
    userToDelete,
    isFiltersModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    hasActiveFilters,

    // Actions
    setSearchTerm,
    setIsFiltersModalOpen,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,

    // Handlers
    handleFilterChange,
    handleApplyFilters,
    handleClearFilters,
    handleSearch,
    handleEditUser,
    handleDeleteUser,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers,
    goToPage,
  };
}; 