import { useState, useEffect, useCallback } from 'react';
import { expressionService } from '@/services/expressionService';
import { IExpression } from '@/types/models/Expression';
import { isAbortError } from '@/utils/common/isAbortError';
import { toast } from 'sonner';

export interface ExpressionFilters {
  // General filters
  search?: string;
  difficulty?: string;
  language?: string;
  type?: string; // Puede ser múltiple separado por comas
  
  // Content filters
  hasImage?: string; // "true" | "false"
  hasContext?: string; // "true" | "false"
  
  // Date filters
  createdAt?: string;
  updatedAt?: string;
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface ExpressionCreate {
  expression: string;
  definition: string;
  language: string;
  difficulty?: string;
  type?: string[];
  context?: string;
  examples?: string[];
  img?: string;
  spanish?: {
    expression: string;
    definition: string;
  };
}

export interface ExpressionUpdate extends Partial<ExpressionCreate> {}

export function useExpressions() {
  const [expressions, setExpressions] = useState<IExpression[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState<ExpressionFilters>({
    page: 1,
    limit: 10,
  });

  // Fetch expressions
  const fetchExpressions = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expressionService.getExpressions({
        ...filters,
        page: currentPage,
        limit,
      }, signal);

      if (signal?.aborted) return;
      // Backend returns { success, message, data: { data, total, page, pages } }
      const responseData = response.data.data;
      setExpressions(responseData.data || []);
      setTotal(responseData.total || 0);
      setTotalPages(responseData.pages || 1);
    } catch (err: any) {
      if (isAbortError(err)) return;
      const errorMsg = err.response?.data?.message || 'Error loading expressions';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters, currentPage, limit]);

  // Create expression
  const createExpression = async (expressionData: ExpressionCreate): Promise<boolean> => {
    try {
      await expressionService.createExpression(expressionData as any);
      toast.success('Expression created successfully');
      await fetchExpressions();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error creating expression';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update expression (optimistic)
  const updateExpression = async (id: string, expressionData: ExpressionUpdate): Promise<boolean> => {
    const prev = expressions;
    setExpressions(curr => curr.map(e => e._id === id ? { ...e, ...expressionData } as IExpression : e));
    try {
      await expressionService.updateExpression(id, expressionData as any);
      toast.success('Expression updated successfully');
      return true;
    } catch (err: any) {
      setExpressions(prev);
      const errorMsg = err.response?.data?.message || 'Error updating expression';
      toast.error(errorMsg);
      return false;
    }
  };

  // Delete expression (optimistic)
  const deleteExpression = async (id: string): Promise<boolean> => {
    const prev = expressions;
    setExpressions(curr => curr.filter(e => e._id !== id));
    setTotal(t => t - 1);
    try {
      await expressionService.deleteExpression(id);
      toast.success('Expression deleted successfully');
      return true;
    } catch (err: any) {
      setExpressions(prev);
      setTotal(t => t + 1);
      const errorMsg = err.response?.data?.message || 'Error deleting expression';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<ExpressionFilters>) => {
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

  // Load expressions on mount and when dependencies change
  useEffect(() => {
    const controller = new AbortController();
    fetchExpressions(controller.signal);
    return () => controller.abort();
  }, [fetchExpressions]);

  return {
    // State
    expressions,
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
    createExpression,
    updateExpression,
    deleteExpression,
    updateFilters,
    clearFilters,
    goToPage,
    refreshExpressions: fetchExpressions,
  };
}
