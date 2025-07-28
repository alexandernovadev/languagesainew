import React from "react";
import { Exam } from "@/services/examService";
import { AlertDialogNova } from "@/components/ui/alert-dialog-nova";

interface ExamDeleteDialogProps {
  exam: Exam | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function ExamDeleteDialog({
  exam,
  isOpen,
  onOpenChange,
  onConfirm,
}: ExamDeleteDialogProps) {
  return (
    <AlertDialogNova
      open={isOpen}
      onOpenChange={onOpenChange}
      title="¿Eliminar examen?"
      description={`¿Estás seguro de que quieres eliminar el examen "${exam?.title}"? Esta acción no se puede deshacer.`}
      onConfirm={onConfirm}
      confirmText="Eliminar"
      cancelText="Cancelar"
    />
  );
}
