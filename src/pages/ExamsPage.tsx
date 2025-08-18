import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExams } from "@/hooks/useExams";
import { ExamSearchAndFilters } from "@/components/exam/ExamSearchAndFilters";
import { ExamTable } from "@/components/exam/ExamTable";
import { ExamPagination } from "@/components/exam/ExamPagination";
import { ExamPageSkeleton } from "@/components/exam/ExamPageSkeleton";
import { ExamFiltersModalNew } from "@/components/exam/ExamFiltersModalNew";
import ExamViewModal from "@/components/exam/ExamViewModal";
import { ExamEditModal } from "@/components/exam/ExamEditModal";
import { ExamDeleteDialog } from "@/components/exam/ExamDeleteDialog";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ExamsPage() {
  const {
    // State
    exams,
    loading,
    searchTerm,
    filters,
    pagination,
    selectedExam,
    isViewModalOpen,
    isFiltersModalOpen,
    isEditModalOpen,
    examToDelete,
    isDeleteDialogOpen,

    // Actions
    setSearchTerm,
    setIsFiltersModalOpen,
    setIsDeleteDialogOpen,

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
  } = useExams();

  // Calcular número de filtros activos directamente desde los filtros del store
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "all" && value !== "createdAt" && value !== "desc"
  ).length;

  // Obtener descripción de filtros activos
  const getActiveFiltersDescription = () => {
    const descriptions: string[] = [];

    if (filters.level && filters.level !== "all") descriptions.push(`Nivel: ${filters.level}`);
    if (filters.language && filters.language !== "all") descriptions.push(`Idioma: ${filters.language}`);
    if (filters.topic && filters.topic !== "all") descriptions.push(`Tema: ${filters.topic}`);
    if (filters.source && filters.source !== "all") descriptions.push(`Origen: ${filters.source}`);
    if (filters.adaptive && filters.adaptive !== "all") descriptions.push(`Tipo: ${filters.adaptive === "true" ? "Adaptativo" : "No Adaptativo"}`);
    if (filters.createdBy && filters.createdBy !== "all") descriptions.push(`Creado por: ${filters.createdBy}`);
    if (filters.createdAfter) descriptions.push(`Creado después: ${filters.createdAfter}`);
    if (filters.createdBefore) descriptions.push(`Creado antes: ${filters.createdBefore}`);
    if (filters.sortBy && filters.sortBy !== "createdAt") descriptions.push(`Ordenar por: ${filters.sortBy}`);
    if (filters.sortOrder && filters.sortOrder !== "desc") descriptions.push(`Orden: ${filters.sortOrder === "asc" ? "Ascendente" : "Descendente"}`);

    return descriptions;
  };

  if (loading) {
    return <ExamPageSkeleton />;
  }

  return (
    <PageLayout>
      <PageHeader
        title="Exámenes"
        description="Gestiona y crea exámenes personalizados para evaluar tu progreso."
        actions={
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFiltersModalOpen(true)}
                    className="h-10 w-10 p-0 relative"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-1 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-green-600 text-white">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    {activeFiltersCount > 0 ? (
                      <div>
                        <div className="font-medium mb-1">
                          {activeFiltersCount} filtro
                          {activeFiltersCount !== 1 ? "s" : ""} activo
                          {activeFiltersCount !== 1 ? "s" : ""}
                        </div>
                        <div className="space-y-1">
                          {getActiveFiltersDescription().map((desc, index) => (
                            <div key={index} className="text-muted-foreground">
                              • {desc}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>Filtrar exámenes</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchExams}
                    disabled={loading}
                    className="h-10 w-10 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualizar exámenes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />

      <ExamSearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
      />

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
        <CardContent className="p-0 pb-4">
          <ExamTable
            exams={exams}
            onView={handleViewExam}
            onEdit={handleEditExam}
            onRemove={handleRemoveExam}
            onTake={handleTakeExam}
            loading={loading}
            searchQuery={searchTerm}
          />
        </CardContent>
      </Card>

      <ExamPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      {/* Modals and Dialogs */}
      <ExamFiltersModalNew
        open={isFiltersModalOpen}
        onOpenChange={setIsFiltersModalOpen}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      <ExamViewModal
        exam={selectedExam}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onEditExam={handleEditExam}
      />

      <ExamEditModal
        exam={selectedExam}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onExamUpdated={fetchExams}
      />

      <ExamDeleteDialog
        exam={examToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageLayout>
  );
}
