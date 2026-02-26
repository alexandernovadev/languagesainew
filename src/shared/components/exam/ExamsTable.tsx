import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useExamAttempts } from "@/shared/hooks/useExamAttempts";
import type { IExam } from "@/types/models";
import { Eye, Play, History, Trash2 } from "lucide-react";
import { languagesJson, certificationLevelsJson } from "@/data/bussiness/shared";

interface ExamsTableProps {
  exams: IExam[];
  loading: boolean;
  onPreview: (exam: IExam) => void;
  onStart: (exam: IExam) => void;
  onAttempts: (exam: IExam) => void;
  onDelete: (exam: IExam) => void;
}

function AttemptsPopoverContent({ examId }: { examId: string }) {
  const { attempts, loading } = useExamAttempts(examId);

  return (
    <div className="space-y-3 min-w-[140px]">
      <p className="text-xs font-semibold text-muted-foreground">Intentos</p>
      {loading ? (
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : attempts.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sin intentos</p>
      ) : (
        <ul className="space-y-1.5">
          {attempts.map((a, i) => (
            <li key={a._id} className="text-sm font-medium tabular-nums">
              #{i + 1} – {a.score}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExamsTable({
  exams,
  loading,
  onPreview,
  onStart,
  onAttempts,
  onDelete,
}: ExamsTableProps) {
  const [openAttemptsExamId, setOpenAttemptsExamId] = useState<string | null>(null);
  const getLangLabel = (v: string) => languagesJson.find((l) => l.value === v)?.label ?? v;
  const getDiffLabel = (v: string) => certificationLevelsJson.find((l) => l.value === v)?.label ?? v;

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exams.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay exámenes</p>
            <p className="text-sm text-muted-foreground mt-1">
              Genera uno desde el Generador de Exámenes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {exams.map((exam) => (
        <Card key={exam._id} className="overflow-hidden">
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Mobile/Tablet: title, btns, detalles. Desktop: title | btns, luego detalles */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="font-semibold text-lg">{exam.title}</h3>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => onPreview(exam)} title="Preview">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="default" size="icon" className="h-9 w-9" onClick={() => onStart(exam)} title="Iniciar">
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onAttempts(exam)}
                  disabled={exam.attemptCount === 0}
                  title="Intentos"
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-9 w-9" onClick={() => onDelete(exam)} title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {getDiffLabel(exam.difficulty)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exam.questions.length} preguntas
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getLangLabel(exam.language)}
              </Badge>
              {typeof exam.attemptCount === "number" && exam.attemptCount > 0 && (
                <Popover
                  open={openAttemptsExamId === exam._id}
                  onOpenChange={(open) => setOpenAttemptsExamId(open ? exam._id : null)}
                >
                  <PopoverTrigger asChild>
                    <Badge
                      variant="blue"
                      className="text-xs cursor-pointer flex flex-row items-center gap-1.5 py-1.5 px-2.5"
                    >
                      <span>
                        {exam.attemptCount} {exam.attemptCount === 1 ? "intento" : "intentos"}
                      </span>
                      {exam.bestScore != null && (
                        <span className="text-[10px] opacity-90 font-normal">
                          Mejor: {exam.bestScore}%
                        </span>
                      )}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto">
                    <AttemptsPopoverContent examId={exam._id} />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
