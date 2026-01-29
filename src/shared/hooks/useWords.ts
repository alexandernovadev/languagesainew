import { useState, useEffect, useCallback } from 'react';
import { wordService } from '@/services/wordService';
import { IWord } from '@/types/models/Word';
import { toast } from 'sonner';

export interface WordFilters {
  wordUser?: string;
  difficulty?: string;
  language?: string;
  type?: string;
  seenMin?: number;
  seenMax?: number;
  hasImage?: string;
  sortBy?: string;
  sortOrder?: string;
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
  sinonyms?: string[];
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

  // Fetch words
  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wordService.getWords(currentPage, limit, filters);
      
      // Backend returns { data: { data: [], total, pages } }
      setWords(response.data.data || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.pages || 1);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error loading words';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
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

  // Update word
  const updateWord = async (id: string, wordData: WordUpdate): Promise<boolean> => {
    try {
      await wordService.updateWord(id, wordData as any);
      toast.success('Word updated successfully');
      await fetchWords();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error updating word';
      toast.error(errorMsg);
      return false;
    }
  };

  // Delete word
  const deleteWord = async (id: string): Promise<boolean> => {
    try {
      await wordService.deleteWord(id);
      toast.success('Word deleted successfully');
      await fetchWords();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error deleting word';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<WordFilters>) => {
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

  // Load words on mount and when dependencies change
  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return {
    // State
    words,
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
    createWord,
    updateWord,
    deleteWord,
    updateFilters,
    clearFilters,
    goToPage,
    refreshWords: fetchWords,
  };
}
