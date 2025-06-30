import { useState, useCallback } from 'react';
import { examAttemptService, ExamAttempt, ExamAnswer, AttemptStats } from '../services/examAttemptService';
import { useAuth } from './useAuth';

export const useExamAttempts = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Iniciar intento
  const startAttempt = useCallback(async (examId: string): Promise<ExamAttempt | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt = await examAttemptService.startAttempt(examId);
      return attempt;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to start attempt';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Obtener intento en progreso
  const getInProgressAttempt = useCallback(async (examId: string): Promise<ExamAttempt | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt = await examAttemptService.getInProgressAttempt(examId);
      return attempt;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get in-progress attempt';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Enviar intento
  const submitAttempt = useCallback(async (attemptId: string, answers: ExamAnswer[]): Promise<ExamAttempt | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt = await examAttemptService.submitAttempt(attemptId, answers);
      return attempt;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to submit attempt';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Calificar con AI
  const gradeAttempt = useCallback(async (attemptId: string): Promise<ExamAttempt | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt = await examAttemptService.gradeAttempt(attemptId);
      return attempt;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to grade attempt';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Obtener intentos del usuario
  const getUserAttempts = useCallback(async (): Promise<ExamAttempt[]> => {
    if (!user?._id) {
      setError('User not authenticated');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const attempts = await examAttemptService.getUserAttempts(user._id);
      return attempts;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get user attempts';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Obtener detalles del intento
  const getAttemptDetails = useCallback(async (attemptId: string): Promise<ExamAttempt | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt = await examAttemptService.getAttemptDetails(attemptId);
      return attempt;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get attempt details';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Abandonar intento
  const abandonAttempt = useCallback(async (attemptId: string): Promise<ExamAttempt | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt = await examAttemptService.abandonAttempt(attemptId);
      return attempt;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to abandon attempt';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Obtener estadísticas
  const getAttemptStats = useCallback(async (examId?: string): Promise<AttemptStats | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const stats = await examAttemptService.getAttemptStats(user._id, examId);
      return stats;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get attempt stats';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Obtener exámenes con intentos
  const getExamsWithAttempts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    level?: string[];
    language?: string[];
    topic?: string;
    source?: string;
    createdBy?: string;
    adaptive?: boolean;
    sortBy?: string;
    sortOrder?: string;
    createdAfter?: string;
    createdBefore?: string;
  }) => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await examAttemptService.getExamsWithAttempts(params);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get exams with attempts';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Obtener estadísticas de intentos de un examen
  const getExamAttemptStats = useCallback(async (examId: string): Promise<AttemptStats | null> => {
    if (!user?._id) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const stats = await examAttemptService.getExamAttemptStats(examId);
      return stats;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get exam attempt stats';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    startAttempt,
    getInProgressAttempt,
    submitAttempt,
    gradeAttempt,
    getUserAttempts,
    getAttemptDetails,
    abandonAttempt,
    getAttemptStats,
    getExamsWithAttempts,
    getExamAttemptStats,
  };
}; 