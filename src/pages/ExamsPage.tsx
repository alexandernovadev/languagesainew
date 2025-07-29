import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExams } from "@/hooks/useExams";
import { ExamSearchAndFilters } from "@/components/exam/ExamSearchAndFilters";
import { ExamTable } from "@/components/exam/ExamTable";
import { ExamPagination } from "@/components/exam/ExamPagination";
import { ExamPageSkeleton } from "@/components/exam/ExamPageSkeleton";
import ExamFiltersModal from "@/components/exam/ExamFiltersModal";
import ExamViewModal from "@/components/exam/ExamViewModal";
import { ExamEditModal } from "@/components/exam/ExamEditModal";
import { ExamDeleteDialog } from "@/components/exam/ExamDeleteDialog";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { Button } from "@/components/ui/button";
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
    hasActiveFilters,

    // Actions
    setSearchTerm,
    setIsFiltersModalOpen,
    setIsDeleteDialogOpen,

    // Handlers
    handleFilterChange,
    handleApplyFilters,
    handleClearFilters,
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
                    className="h-10 w-10 p-0"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtrar exámenes</p>
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
        onFiltersClick={() => setIsFiltersModalOpen(true)}
        onRefresh={fetchExams}
        hasActiveFilters={hasActiveFilters}
        loading={loading}
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

      <ExamPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      {/* Modals and Dialogs */}
      <ExamFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
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
