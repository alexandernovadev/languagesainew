import { useState, useEffect, useCallback } from "react";
import { examService } from "@/services/examService";
import type { IExam } from "@/types/models";
import { isAbortError } from "@/utils/common/isAbortError";
import { toast } from "sonner";

export interface ExamFilters {
  search?: string;
  difficulty?: string;
  language?: string;
  page?: number;
  limit?: number;
}

export function useExams() {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ExamFilters>({});
  const limit = 20;

  const fetchExams = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const result = await examService.list(currentPage, limit, filters, signal);
      if (signal?.aborted) return;
      setExams(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(Math.max(1, Math.ceil((result.total || 0) / limit)));
    } catch (err: any) {
      if (isAbortError(err)) return;
      const errorMsg = err.response?.data?.message || "Error al cargar exámenes";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [currentPage, filters, limit]);

  useEffect(() => {
    const controller = new AbortController();
    fetchExams(controller.signal);
    return () => controller.abort();
  }, [fetchExams]);

  // Delete exam (optimistic)
  const deleteExam = useCallback(async (id: string): Promise<boolean> => {
    const prev = exams;
    setExams(curr => curr.filter(e => e._id !== id));
    setTotal(t => t - 1);
    try {
      await examService.delete(id);
      toast.success("Examen eliminado");
      return true;
    } catch (err: any) {
      setExams(prev);
      setTotal(t => t + 1);
      toast.error(err.response?.data?.message || "Error al eliminar");
      return false;
    }
  }, [exams]);

  const updateFilters = (newFilters: Partial<ExamFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    exams,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    filters,
    deleteExam,
    updateFilters,
    clearFilters,
    goToPage,
    refreshExams: fetchExams,
  };
}
