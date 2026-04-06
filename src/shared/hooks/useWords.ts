import { useState, useEffect, useCallback } from 'react';
import { wordService } from '@/services/wordService';
import { IWord } from '@/types/models/Word';
import { isAbortError } from '@/utils/common/isAbortError';
import { useFilterUrlSync } from './useFilterUrlSync';
import { toast } from 'sonner';

export interface WordFilters {
  // General filters
  wordUser?: string;
  difficulty?: string;
  language?: string;
  type?: string;

  // Spanish filters
  spanishWord?: string;
  spanishDefinition?: string;

  // Content filters
  definition?: string;
  IPA?: string;
  hasExamples?: boolean;
  hasSynonyms?: boolean;
  hasCodeSwitching?: boolean;
  hasImage?: string;

  // Advanced filters
  seenMin?: number;
  seenMax?: number;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;

  // Sorting
  sortBy?: string;
  sortOrder?: string;

  // Pagination
  page?: number;
  limit?: number;
}

export interface WordCreate {
  word: string;
  definition: string;
  language: string;
  difficulty?: string;
  type?: string[];
  IPA?: string;
  examples?: string[];
  synonyms?: string[];
  codeSwitching?: string[];
  img?: string;
  spanish?: {
    word: string;
    definition: string;
  };
}

export interface WordUpdate extends Partial<WordCreate> {}

export function useWords() {
  const [words, setWords] = useState<IWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Filters
  const [filters, setFilters] = useState<WordFilters>({
    page: 1,
    limit: 10,
  });

  // Update filters
  const updateFilters = (newFilters: Partial<WordFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // URL sync — sets isReady=true once URL params have been applied on mount
  const { isReady } = useFilterUrlSync(filters, updateFilters);

  // Fetch words
  const fetchWords = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await wordService.getWords(currentPage, limit, filters, signal);

      if (signal?.aborted) return;
      setWords(response.data.data || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.pages || 1);
    } catch (err: any) {
      if (isAbortError(err)) return;
      const errorMsg = err.response?.data?.message || 'Error loading words';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters, currentPage, limit]);

  // Create word
  const createWord = async (wordData: WordCreate): Promise<boolean> => {
    try {
      await wordService.createWord(wordData as any);
      toast.success('Word created successfully');
      await fetchWords();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error creating word';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update word (optimistic)
  const updateWord = async (id: string, wordData: WordUpdate): Promise<boolean> => {
    const prev = words;
    setWords(curr => curr.map(w => w._id === id ? { ...w, ...wordData } as IWord : w));
    try {
      await wordService.updateWord(id, wordData as any);
      toast.success('Word updated successfully');
      return true;
    } catch (err: any) {
      setWords(prev);
      const errorMsg = err.response?.data?.message || 'Error updating word';
      toast.error(errorMsg);
      return false;
    }
  };

  // Delete word (optimistic)
  const deleteWord = async (id: string): Promise<boolean> => {
    const prev = words;
    setWords(curr => curr.filter(w => w._id !== id));
    setTotal(t => t - 1);
    try {
      await wordService.deleteWord(id);
      toast.success('Word deleted successfully');
      return true;
    } catch (err: any) {
      setWords(prev);
      setTotal(t => t + 1);
      const errorMsg = err.response?.data?.message || 'Error deleting word';
      toast.error(errorMsg);
      return false;
    }
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

  // Fetch on mount (after URL sync) and whenever filters/page change
  useEffect(() => {
    if (!isReady) return;
    const controller = new AbortController();
    fetchWords(controller.signal);
    return () => controller.abort();
  }, [fetchWords, isReady]);

  return {
    words,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    limit,
    filters,
    createWord,
    updateWord,
    deleteWord,
    updateFilters,
    clearFilters,
    goToPage,
    refreshWords: fetchWords,
  };
}
