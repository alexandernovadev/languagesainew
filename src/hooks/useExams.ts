import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { examService, Exam } from "@/services/examService";
import { toast } from "sonner";

interface ExamFilters {
  level: string;
  language: string;
  topic: string;
  source: string;
  adaptive: string;
  createdBy: string;
  sortBy: string;
  sortOrder: string;
  createdAfter: string;
  createdBefore: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UseExamsReturn {
  // State
  exams: Exam[];
  loading: boolean;
  searchTerm: string;
  filters: ExamFilters;
  pagination: Pagination;
  selectedExam: Exam | null;
  isViewModalOpen: boolean;
  isFiltersModalOpen: boolean;
  examToDelete: Exam | null;
  isDeleteDialogOpen: boolean;
  isEditModalOpen: boolean;
  hasActiveFilters: boolean;

  // Actions
  setSearchTerm: (term: string) => void;
  setFilters: (filters: ExamFilters) => void;
  setSelectedExam: (exam: Exam | null) => void;
  setExamToDelete: (exam: Exam | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
  setIsFiltersModalOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;

  // Handlers
  handleFilterChange: (newFilters: ExamFilters) => void;
  handleSearch: () => void;
  handleViewExam: (exam: Exam) => void;
  handleTakeExam: (exam: Exam) => void;
  handleEditExam: (exam: Exam) => void;
  handleRemoveExam: (exam: Exam) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCloseViewModal: () => void;
  handleCloseEditModal: () => void;
  fetchExams: () => Promise<void>;
  goToPage: (page: number) => void;
}

const defaultFilters: ExamFilters = {
  level: "all",
  language: "all",
  topic: "all",
  source: "all",
  adaptive: "all",
  createdBy: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  createdAfter: "",
  createdBefore: "",
};

export function useExams(): UseExamsReturn {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ExamFilters>(defaultFilters);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filtersFirstRender = useRef(true);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Pagination
      params.append("page", pagination.currentPage.toString());
      params.append("limit", pagination.itemsPerPage.toString());

      // Search
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      // Filters
      if (filters.level !== "all") params.append("level", filters.level);
      if (filters.language !== "all")
        params.append("language", filters.language);
      if (filters.topic !== "all") params.append("topic", filters.topic);
      if (filters.source !== "all") params.append("source", filters.source);
      if (filters.adaptive !== "all")
        params.append("adaptive", filters.adaptive);
      if (filters.createdBy !== "all")
        params.append("createdBy", filters.createdBy);

      // Sorting
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);

      // Date filters
      if (filters.createdAfter)
        params.append("createdAfter", filters.createdAfter);
      if (filters.createdBefore)
        params.append("createdBefore", filters.createdBefore);

      const response = await examService.getExams(params.toString());

      if (response && response.success && response.data) {
        setExams(response.data.data || []);

        setPagination({
          currentPage: response.data.page || 1,
          totalPages: response.data.pages || 1,
          totalItems: response.data.total || 0,
          itemsPerPage: pagination.itemsPerPage,
        });

        toast.success("Exámenes cargados exitosamente");
      } else {
        console.warn("Unexpected response structure:", response);
        setExams([]);
        setPagination((prev) => ({
          ...prev,
          totalPages: 1,
          totalItems: 0,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching exams:", error);
      toast.error("Error al cargar exámenes", {
        description: error.message || "No se pudieron cargar los exámenes",
      });
      setExams([]);
      setPagination((prev) => ({
        ...prev,
        totalPages: 1,
        totalItems: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleFilterChange = (newFilters: ExamFilters) => {
    setFilters(newFilters);
    goToPage(1);
  };

  const handleSearch = () => {
    goToPage(1);
    fetchExams().catch((error) => {
      toast.error("Error en la búsqueda", {
        description: error.message || "No se pudo realizar la búsqueda",
      });
    });
  };

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsViewModalOpen(true);
  };

  const handleTakeExam = (exam: Exam) => {
    // Navegación usando slug: /exams/:examSlug/take
    navigate(`/exams/${exam.slug}/take`);
  };

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const handleRemoveExam = (exam: Exam) => {
    setExamToDelete(exam);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!examToDelete) return;

    try {
      setLoading(true);

      // Call the delete API
      const response = await examService.deleteExam(examToDelete._id);

      if (response && response.success) {
        toast.success("Examen eliminado exitosamente", {
          description: `"${examToDelete.title}" ha sido eliminado`,
        });

        // Remove the exam from the local state
        setExams((prevExams) =>
          prevExams.filter((exam) => exam._id !== examToDelete._id)
        );

        // Update pagination
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - 1,
        }));

        // Close the dialog and reset state
        setIsDeleteDialogOpen(false);
        setExamToDelete(null);

        // Refresh the exams list to ensure consistency
        await fetchExams();
      } else {
        throw new Error(response?.message || "Error al eliminar el examen");
      }
    } catch (error: any) {
      console.error("Error deleting exam:", error);
      toast.error("Error al eliminar examen", {
        description: error.message || "No se pudo eliminar el examen",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedExam(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedExam(null);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value && value !== "all" && value !== "createdAt" && value !== "desc"
  );

  // Effects
  useEffect(() => {
    fetchExams().catch((error) => {
      toast.error("Error al cargar exámenes", {
        description: error.message || "No se pudieron cargar los exámenes",
      });
    });
  }, []); // Initial load

  useEffect(() => {
    if (filtersFirstRender.current) {
      filtersFirstRender.current = false;
      return;
    }
    if (pagination.currentPage > 0) {
      fetchExams().catch((error) => {
        toast.error("Error al cargar exámenes", {
          description: error.message || "No se pudieron cargar los exámenes",
        });
      });
    }
  }, [
    pagination.currentPage,
    filters.sortBy,
    filters.sortOrder,
    filters.level,
    filters.language,
    filters.topic,
    filters.source,
    filters.adaptive,
    filters.createdBy,
    filters.createdAfter,
    filters.createdBefore,
  ]);

  return {
    // State
    exams,
    loading,
    searchTerm,
    filters,
    pagination,
    selectedExam,
    isViewModalOpen,
    isFiltersModalOpen,
    examToDelete,
    isDeleteDialogOpen,
    isEditModalOpen,
    hasActiveFilters,

    // Actions
    setSearchTerm,
    setFilters,
    setSelectedExam,
    setExamToDelete,
    setIsViewModalOpen,
    setIsFiltersModalOpen,
    setIsDeleteDialogOpen,
    setIsEditModalOpen,

    // Handlers
    handleFilterChange,
    handleSearch,
    handleViewExam,
    handleTakeExam,
    handleEditExam,
    handleRemoveExam,
    handleConfirmDelete,
    handleCloseViewModal,
    handleCloseEditModal,
    fetchExams,
    goToPage,
  };
}
