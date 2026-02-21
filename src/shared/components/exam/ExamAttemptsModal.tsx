import { useState } from "react";
import { ModalNova } from "@/shared/components/ui/modal-nova";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertDialogNova } from "@/shared/components/ui/alert-dialog-nova";
import { useExamAttempts } from "@/shared/hooks/useExamAttempts";
import { ExamAttemptResultCard } from "./ExamAttemptResultCard";
import { ExamDetailBar } from "./ExamDetailBar";
import { examService } from "@/services/examService";
import type { IExam } from "@/types/models";
import type { IExamAttempt } from "@/types/models";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/utils/common/classnames";
import { toast } from "sonner";

interface ExamAttemptsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: IExam | null;
}

export function ExamAttemptsModal({ open, onOpenChange, exam }: ExamAttemptsModalProps) {
  const { attempts, loading, refreshAttempts } = useExamAttempts(exam?._id ?? null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [attemptToDelete, setAttemptToDelete] = useState<IExamAttempt | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const selectedAttempt = attempts[selectedIndex];

  const formatDate = (d: Date) => {
    const date = new Date(d);
    return date.toLocaleDateString("es", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteClick = () => {
    if (selectedAttempt) setAttemptToDelete(selectedAttempt);
  };

  const handleDeleteConfirm = async () => {
    if (!attemptToDelete || !exam) return;
    setDeleteLoading(true);
    try {
      await examService.deleteAttempt(exam._id, attemptToDelete._id);
      await refreshAttempts();
      setAttemptToDelete(null);
      setSelectedIndex((i) => Math.max(0, i - 1));
      toast.success("Intento eliminado");
    } catch {
      toast.error("Error al eliminar el intento");
    } finally {
      setDeleteLoading(false);
    }
  };

  const resultExam = selectedAttempt
    ? (typeof selectedAttempt.examId === "object" ? selectedAttempt.examId : exam)
    : null;
  const meta = resultExam
    ? {
        language: resultExam.language,
        difficulty: resultExam.difficulty,
        grammarTopics: resultExam.grammarTopics,
        topic: resultExam.topic,
      }
    : null;

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={exam ? `Intentos: ${exam.title}` : "Intentos"}
      size="2xl"
      height="h-[90dvh]"
    >
      <div className="px-2 sm:px-4 py-4 space-y-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : attempts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay intentos para este examen
          </p>
        ) : selectedAttempt ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight">
                  {resultExam?.title ?? exam?.title ?? "Intentos"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Intento #{selectedIndex + 1} · {formatDate(selectedAttempt.completedAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-center justify-center rounded-xl border bg-card px-6 py-4 min-w-[100px]">
                  <span
                    className={cn(
                      "text-3xl font-bold tabular-nums",
                      selectedAttempt.score >= 70
                        ? "text-emerald-600 dark:text-emerald-400"
                        : selectedAttempt.score >= 50
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {selectedAttempt.score}%
                  </span>
                  <span className="text-xs font-medium text-muted-foreground mt-0.5">
                    Puntuación
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
                      disabled={selectedIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedIndex((i) => Math.min(attempts.length - 1, i + 1))
                      }
                      disabled={selectedIndex === attempts.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteClick}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {attempts.map((a, i) => (
                <Button
                  key={a._id}
                  variant={selectedIndex === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndex(i)}
                >
                  #{i + 1} {a.score}%
                </Button>
              ))}
            </div>

            {meta && (
              <ExamDetailBar
                meta={meta}
                questionCount={selectedAttempt.attemptQuestions.length}
              />
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resultados por pregunta</h3>
              <ScrollArea className="h-[45vh] pr-4">
                <div className="space-y-4 pb-8">
                  {selectedAttempt.attemptQuestions.map((aq, i) => (
                    <ExamAttemptResultCard key={i} aq={aq} index={i} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        ) : null}
      </div>

      <AlertDialogNova
        open={!!attemptToDelete}
        onOpenChange={(o) => !o && setAttemptToDelete(null)}
        title="¿Eliminar intento?"
        description={
          attemptToDelete ? (
            <span>
              Se eliminará el intento con {attemptToDelete.score}% de puntuación. Esta acción no se puede deshacer.
            </span>
          ) : undefined
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
        confirmVariant="destructive"
      />
    </ModalNova>
  );
}
