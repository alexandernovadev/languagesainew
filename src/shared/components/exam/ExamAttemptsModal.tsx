import { useState } from "react";
import { ModalNova } from "@/shared/components/ui/modal-nova";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useExamAttempts } from "@/shared/hooks/useExamAttempts";
import type { IExam } from "@/types/models";
import type { IExamAttempt, IAttemptQuestion } from "@/types/models";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/common/classnames";

interface ExamAttemptsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: IExam | null;
}

function AttemptDetailCard({ aq, index }: { aq: IAttemptQuestion; index: number }) {
  return (
    <Card className={cn("overflow-hidden", !aq.isCorrect && "border-destructive/50")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">Pregunta {index + 1}</CardTitle>
          {aq.isCorrect ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>{aq.questionText}</p>
        <p className="text-muted-foreground">
          <span className="font-medium">Tu respuesta:</span>{" "}
          {typeof aq.userAnswer === "number" && aq.options
            ? aq.options[aq.userAnswer]
            : String(aq.userAnswer)}
        </p>
        {!aq.isCorrect && (
          <p className="text-sm">
            <span className="font-medium text-green-600">Correcta:</span>{" "}
            {typeof aq.correctIndex === "number" && aq.options?.length
              ? aq.options[aq.correctIndex]
              : String(aq.correctAnswer ?? "")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ExamAttemptsModal({ open, onOpenChange, exam }: ExamAttemptsModalProps) {
  const { attempts, loading } = useExamAttempts(exam?._id ?? null);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={exam ? `Intentos: ${exam.title}` : "Intentos"}
      size="2xl"
      height="h-[85dvh]"
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      }
    >
      <div className="px-2 sm:px-4 py-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : attempts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay intentos para este examen
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2 overflow-x-auto">
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
              {selectedAttempt && (
                <div className="text-sm text-muted-foreground shrink-0">
                  {formatDate(selectedAttempt.completedAt)}
                </div>
              )}
            </div>

            {selectedAttempt && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
                  disabled={selectedIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Badge variant="secondary">Score: {selectedAttempt.score}%</Badge>
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
            )}

            {selectedAttempt && (
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-4 pb-4">
                  {selectedAttempt.attemptQuestions.map((aq, i) => (
                    <AttemptDetailCard key={i} aq={aq} index={i} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </>
        )}
      </div>
    </ModalNova>
  );
}
