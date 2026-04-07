import { useEffect, useCallback } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ExamsTable } from "@/shared/components/exam/ExamsTable";
import { ExamPreviewModal } from "@/shared/components/exam/ExamPreviewModal";
import { ExamAttemptsModal } from "@/shared/components/exam/ExamAttemptsModal";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { TablePagination } from "@/shared/components/ui/table-pagination";
import { useExams } from "@/shared/hooks/useExams";
import { useExamsUIStore } from "@/lib/store/exams-store";
import type { IExam } from "@/types/models";
import { useNavigate, useLocation } from "react-router-dom";

export default function ExamsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { exams, loading, currentPage, totalPages, total, deleteExam, goToPage, refreshExams } = useExams();

  const {
    previewOpen, setPreviewOpen,
    previewExam, setPreviewExam,
    attemptsOpen, setAttemptsOpen,
    attemptsExam, setAttemptsExam,
    deleteOpen, setDeleteOpen,
    examToDelete, setExamToDelete,
    deleteLoading, setDeleteLoading,
  } = useExamsUIStore();

  useEffect(() => {
    const state = location.state as { openAttemptsExam?: IExam } | null;
    if (state?.openAttemptsExam) {
      setAttemptsExam(state.openAttemptsExam);
      setAttemptsOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname, setAttemptsExam, setAttemptsOpen]);

  const handlePreview = useCallback((exam: IExam) => {
    setPreviewExam(exam);
    setPreviewOpen(true);
  }, [setPreviewExam, setPreviewOpen]);

  const handleStart = useCallback((exam: IExam) => {
    navigate(`/exams/${exam._id}/start`);
  }, [navigate]);

  const handleAttempts = useCallback((exam: IExam) => {
    setAttemptsExam(exam);
    setAttemptsOpen(true);
  }, [setAttemptsExam, setAttemptsOpen]);

  const handleDeleteClick = useCallback((exam: IExam) => {
    setExamToDelete(exam);
    setDeleteOpen(true);
  }, [setExamToDelete, setDeleteOpen]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!examToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteExam(examToDelete._id);
      setDeleteOpen(false);
      setExamToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [examToDelete, deleteExam, setDeleteLoading, setDeleteOpen, setExamToDelete]);

  return (
    <div className="">
      <PageHeader
        title="Exámenes"
        description="Lista de exámenes de gramática disponibles"
      />

      <ExamsTable
        exams={exams}
        loading={loading}
        onPreview={handlePreview}
        onStart={handleStart}
        onAttempts={handleAttempts}
        onDelete={handleDeleteClick}
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        itemsCount={exams.length}
        itemLabel="exams"
        onPageChange={goToPage}
      />

      <ExamPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} exam={previewExam} />

      <ExamAttemptsModal open={attemptsOpen} onOpenChange={setAttemptsOpen} exam={attemptsExam} />

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
