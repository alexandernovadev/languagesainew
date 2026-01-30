import { useState, useEffect, useCallback } from 'react';
import { lectureService } from '@/services/lectureService';
import { ILecture } from '@/types/models/Lecture';
import { toast } from 'sonner';

export interface LectureFilters {
  // General filters
  search?: string;
  level?: string; // CertificationLevel
  language?: string;
  typeWrite?: string;
  
  // Time filters
  timeMin?: number;
  timeMax?: number;
  
  // Date filters
  createdAfter?: string;
  createdBefore?: string;
  
  // Sorting
  sortBy?: string;
  sortOrder?: string;
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface LectureCreate {
  time: number;
  difficulty: string;
  typeWrite: string;
  language: string;
  img?: string;
  urlAudio?: string;
  content: string;
}

export interface LectureUpdate extends Partial<LectureCreate> {}

export function useLectures() {
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState<LectureFilters>({
    page: 1,
    limit: 10,
  });

  // Fetch lectures
  const fetchLectures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await lectureService.getLectures(currentPage, limit, filters.search || "", filters);
      
      // Backend returns { success, message, data: { data: [], total, pages, page } }
      const responseData = response.data;
      setLectures(responseData.data || []);
      setTotal(responseData.total || 0);
      setTotalPages(responseData.pages || 1);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error loading lectures';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, limit]);

  // Create lecture
  const createLecture = async (lectureData: LectureCreate): Promise<boolean> => {
    try {
      await lectureService.postLecture(lectureData as any);
      toast.success('Lecture created successfully');
      await fetchLectures();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error creating lecture';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update lecture
  const updateLecture = async (id: string, lectureData: LectureUpdate): Promise<boolean> => {
    try {
      await lectureService.updateLecture(id, lectureData as any);
      toast.success('Lecture updated successfully');
      await fetchLectures();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error updating lecture';
      toast.error(errorMsg);
      return false;
    }
  };

  // Delete lecture
  const deleteLecture = async (id: string): Promise<boolean> => {
    try {
      await lectureService.deleteLecture(id);
      toast.success('Lecture deleted successfully');
      await fetchLectures();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error deleting lecture';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<LectureFilters>) => {
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

  // Load lectures on mount and when dependencies change
  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return {
    // State
    lectures,
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
    createLecture,
    updateLecture,
    deleteLecture,
    updateFilters,
    clearFilters,
    goToPage,
    refreshLectures: fetchLectures,
  };
}
