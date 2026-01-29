import { useState, useEffect, useCallback } from 'react';
import { userService, User, UserCreate, UserUpdate, UserFilters } from '@/services/userService';
import { toast } from 'sonner';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers({
        ...filters,
        page: currentPage,
        limit,
      });
      
      // Backend returns { data: { data: [], total, pages } }
      setUsers(response.data.data || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.pages || 1);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error loading users';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, limit]);

  // Create user
  const createUser = async (userData: UserCreate): Promise<boolean> => {
    try {
      await userService.createUser(userData);
      toast.success('User created successfully');
      await fetchUsers();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error creating user';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update user
  const updateUser = async (id: string, userData: UserUpdate): Promise<boolean> => {
    try {
      await userService.updateUser(id, userData);
      toast.success('User updated successfully');
      await fetchUsers();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error updating user';
      toast.error(errorMsg);
      return false;
    }
  };

  // Delete user
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await userService.deleteUser(id);
      toast.success('User deleted successfully');
      await fetchUsers();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error deleting user';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ page: 1, limit: 10 });
    setCurrentPage(1);
  };

  // Change page
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Load users on mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // State
    users,
    loading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    total,
    limit,
    
    // Filters
    filters,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    updateFilters,
    clearFilters,
    goToPage,
    refreshUsers: fetchUsers,
  };
}
