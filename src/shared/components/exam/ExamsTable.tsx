import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
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

export function ExamsTable({
  exams,
  loading,
  onPreview,
  onStart,
  onAttempts,
  onDelete,
}: ExamsTableProps) {
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
                <Button variant="outline" size="sm" onClick={() => onPreview(exam)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="default" size="sm" onClick={() => onStart(exam)}>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAttempts(exam)}
                  disabled={exam.attemptCount === 0}
                >
                  <History className="h-4 w-4 mr-2" />
                  Intentos
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(exam)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
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
              {typeof exam.attemptCount === "number" && (
                <Badge variant="blue" className="text-xs">
                  {exam.attemptCount} {exam.attemptCount === 1 ? "intento" : "intentos"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
