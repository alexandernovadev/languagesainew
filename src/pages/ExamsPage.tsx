import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Play,
  RotateCcw,
} from "lucide-react";
import { examService, Exam } from "@/services/examService";
import { useNavigate } from "react-router-dom";
import { ExamTable } from "@/components/exam/ExamTable";
import ExamFiltersModal from "@/components/exam/ExamFiltersModal";
import ExamViewModal from "@/components/exam/ExamViewModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ExamFilters>({
    level: "all",
    language: "all",
    topic: "all",
    source: "all",
    adaptive: "all",
    createdBy: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    createdAfter: "",
    createdBefore: "",
  });
  const [pagination, setPagination] = useState({
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
  const navigate = useNavigate();

  // Evitar fetch duplicado por filtros/paginación al montar
  const filtersFirstRender = useRef(true);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      // Agregar filtros solo si no son 'all' o están vacíos
      if (filters.level && filters.level !== "all")
        params.append("level", filters.level);
      if (filters.language && filters.language !== "all")
        params.append("language", filters.language);
      if (filters.topic && filters.topic !== "all")
        params.append("topic", filters.topic);
      if (filters.source && filters.source !== "all")
        params.append("source", filters.source);
      if (filters.adaptive && filters.adaptive !== "all")
        params.append("adaptive", filters.adaptive);
      if (filters.createdBy) params.append("createdBy", filters.createdBy);
      if (filters.createdAfter)
        params.append("createdAfter", filters.createdAfter);
      if (filters.createdBefore)
        params.append("createdBefore", filters.createdBefore);

      console.log("Fetching exams with params:", params.toString());
      const response = await examService.getExams(params.toString());
      console.log("API Response:", response);

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

  useEffect(() => {
    // Initial fetch on component mount
    fetchExams().catch((error) => {
      toast.error("Error al cargar exámenes", {
        description: error.message || "No se pudieron cargar los exámenes",
      });
    });
  }, []); // Empty dependency array for initial load

  useEffect(() => {
    // Fetch when pagination or filters change (but not on initial mount)
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

  const handleFilterChange = (newFilters: ExamFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchExams().catch((error) => {
      toast.error("Error al aplicar filtros", {
        description: error.message || "No se pudieron aplicar los filtros",
      });
    });
  };

  const handleClearFilters = () => {
    const defaultFilters: ExamFilters = {
      level: "all",
      language: "all",
      topic: "all",
      source: "all",
      adaptive: "all",
      createdBy: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      createdAfter: "",
      createdBefore: "",
    };
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchExams().catch((error) => {
      toast.error("Error al limpiar filtros", {
        description: error.message || "No se pudieron limpiar los filtros",
      });
    });
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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
    // Por ahora no hace nada, como solicitaste
    toast.info("Función de contestar examen en desarrollo", {
      description: "Esta funcionalidad estará disponible próximamente",
    });
  };

  const handleEditExam = (exam: Exam) => {
    // Por ahora no hace nada, como solicitaste
    toast.info("Función de editar examen en desarrollo", {
      description: "Esta funcionalidad estará disponible próximamente",
    });
  };

  const handleRemoveExam = (exam: Exam) => {
    setExamToDelete(exam);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!examToDelete) return;

    try {
      // Por ahora no hace nada, como solicitaste
      toast.info("Función de eliminar examen en desarrollo", {
        description: "Esta funcionalidad estará disponible próximamente",
      });
      setIsDeleteDialogOpen(false);
      setExamToDelete(null);
    } catch (error: any) {
      toast.error("Error al eliminar examen", {
        description: error.message || "No se pudo eliminar el examen",
      });
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedExam(null);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value && value !== "all" && value !== "createdAt" && value !== "desc"
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Exámenes</h1>
            <p className="text-muted-foreground">
              Gestiona y revisa todos tus exámenes
            </p>
          </div>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Crear Examen
          </Button>
        </div>

        {/* Skeleton Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-1">
            <div className="h-10 bg-muted rounded flex-1 animate-pulse"></div>
            <div className="h-10 bg-muted rounded w-10 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-muted rounded w-10 animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Table */}
        <Card>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Exámenes</h1>
          <p className="text-muted-foreground">
            Gestiona y revisa todos tus exámenes
          </p>
        </div>
        <Button onClick={() => navigate("/generator/exam")}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Examen
        </Button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Buscar exámenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFiltersModalOpen(true)}
            className={hasActiveFilters ? "border-blue-500 text-blue-600" : ""}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                !
              </Badge>
            )}
          </Button>
          <Button variant="outline" onClick={fetchExams} disabled={loading}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Exámenes</span>
            <span className="text-sm text-muted-foreground">
              {pagination.totalItems} exámenes encontrados
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="table-container">
            <ExamTable
              exams={exams}
              onView={handleViewExam}
              onEdit={handleEditExam}
              onRemove={handleRemoveExam}
              onTake={handleTakeExam}
              loading={loading}
              searchQuery={searchTerm}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={pagination.currentPage === 1}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
            >
              Anterior
            </Button>

            <span className="flex items-center px-4">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      <ExamFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Exam View Modal */}
      <ExamViewModal
        exam={selectedExam}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onEditExam={handleEditExam}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar examen?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar el examen "
              {examToDelete?.title}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 border-none"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
