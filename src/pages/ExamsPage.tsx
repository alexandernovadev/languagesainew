import { useState } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { ExamsTable } from "@/shared/components/exam/ExamsTable";
import { ExamPreviewModal } from "@/shared/components/exam/ExamPreviewModal";
import { ExamAttemptsModal } from "@/shared/components/exam/ExamAttemptsModal";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { useExams } from "@/shared/hooks/useExams";
import type { IExam } from "@/types/models";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

export default function ExamsPage() {
  const navigate = useNavigate();
  const {
    exams,
    loading,
    currentPage,
    totalPages,
    deleteExam,
    goToPage,
    refreshExams,
  } = useExams();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewExam, setPreviewExam] = useState<IExam | null>(null);
  const [attemptsOpen, setAttemptsOpen] = useState(false);
  const [attemptsExam, setAttemptsExam] = useState<IExam | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<IExam | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePreview = (exam: IExam) => {
    setPreviewExam(exam);
    setPreviewOpen(true);
  };

  const handleAttempts = (exam: IExam) => {
    setAttemptsExam(exam);
    setAttemptsOpen(true);
  };

  const handleDeleteClick = (exam: IExam) => {
    setExamToDelete(exam);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (examToDelete) {
      setDeleteLoading(true);
      try {
        await deleteExam(examToDelete._id);
        setDeleteOpen(false);
        setExamToDelete(null);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Exámenes"
          description="Lista de exámenes de gramática disponibles"
        />
        <Button onClick={() => navigate("/exams/generator")}>
          <Plus className="h-4 w-4 mr-2" />
          Generar examen
        </Button>
      </div>

      <ExamsTable
        exams={exams}
        loading={loading}
        onPreview={handlePreview}
        onStart={() => {}}
        onAttempts={handleAttempts}
        onDelete={handleDeleteClick}
      />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ExamPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        exam={previewExam}
      />

      <ExamAttemptsModal
        open={attemptsOpen}
        onOpenChange={setAttemptsOpen}
        exam={attemptsExam}
      />

      <AlertDialogNova
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="¿Eliminar examen?"
        description={
          examToDelete ? (
            <span>
              Se eliminará &quot;{examToDelete.title}&quot; y todos sus intentos. Esta acción no se puede deshacer.
            </span>
          ) : undefined
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
        confirmVariant="destructive"
      />
    </div>
  );
}
