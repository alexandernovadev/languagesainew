import { useState, useEffect, useCallback, useRef } from 'react';
import { wordService } from '@/services/wordService';
import { IWord } from '@/types/models/Word';
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

  // Flag para saber si ya se hizo la primera carga
  const hasInitialLoad = useRef(false);
  // Ref para rastrear si los filtros han cambiado desde el estado inicial
  const initialFiltersSet = useRef(false);

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
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Marcar que los filtros han sido establecidos (probablemente desde la URL)
      if (!initialFiltersSet.current) {
        initialFiltersSet.current = true;
      }
      return updated;
    });
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
    // Solo hacer la primera llamada después de que los filtros hayan sido establecidos
    // Esto evita hacer una llamada sin filtros y luego otra con filtros
    if (!hasInitialLoad.current) {
      // Si los filtros ya fueron establecidos (desde la URL), hacer la llamada inmediatamente
      if (initialFiltersSet.current) {
        hasInitialLoad.current = true;
        fetchWords();
      } else {
        // Si aún no se han establecido los filtros, esperar un pequeño delay
        // para dar tiempo a que useFilterUrlSync cargue los filtros de la URL
        const timeoutId = setTimeout(() => {
          hasInitialLoad.current = true;
          fetchWords();
        }, 50); // Delay suficiente para que useFilterUrlSync se ejecute
        return () => clearTimeout(timeoutId);
      }
    } else {
      fetchWords();
    }
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
