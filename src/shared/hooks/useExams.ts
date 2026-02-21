import { useState, useEffect, useCallback } from "react";
import { examService } from "@/services/examService";
import type { IExam } from "@/types/models";
import { toast } from "sonner";

export function useExams() {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const result = await examService.list(currentPage, limit);
      setExams(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(Math.max(1, Math.ceil((result.total || 0) / limit)));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al cargar exámenes");
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const deleteExam = useCallback(async (id: string): Promise<boolean> => {
    try {
      await examService.delete(id);
      toast.success("Examen eliminado");
      await fetchExams();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al eliminar");
      return false;
    }
  }, [fetchExams]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    exams,
    loading,
    currentPage,
    totalPages,
    total,
    deleteExam,
    goToPage,
    refreshExams: fetchExams,
  };
}
