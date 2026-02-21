import { useState, useEffect, useCallback } from "react";
import { examService } from "@/services/examService";
import type { IExamAttempt } from "@/types/models";
import { toast } from "sonner";

export function useExamAttempts(examId: string | null) {
  const [attempts, setAttempts] = useState<IExamAttempt[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttempts = useCallback(async () => {
    if (!examId) {
      setAttempts([]);
      return;
    }
    setLoading(true);
    try {
      const data = await examService.listAttemptsByExam(examId, 50);
      setAttempts(data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al cargar intentos");
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  return { attempts, loading, refreshAttempts: fetchAttempts };
}
