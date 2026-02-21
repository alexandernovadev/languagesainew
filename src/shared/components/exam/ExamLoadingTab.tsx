import { Badge } from "@/shared/components/ui/badge";
import { Loader2 } from "lucide-react";
import { languagesJson, certificationLevelsJson } from "@/data/bussiness/shared";
import type { ExamQuestionType } from "@/types/models";

const QUESTION_TYPE_LABELS: Record<ExamQuestionType, string> = {
  multiple: "Opción múltiple",
  unique: "Respuesta única",
  fillInBlank: "Completar huecos",
  translateText: "Traducir texto",
};

interface ExamGeneratorParams {
  language: string;
  difficulty: string;
  grammarTopics: string[];
  questionTypes: ExamQuestionType[];
  questionCount: number;
  topic: string;
}

interface ExamLoadingTabProps {
  params: ExamGeneratorParams;
}

export function ExamLoadingTab({ params }: ExamLoadingTabProps) {
  const langLabel = languagesJson.find((l) => l.value === params.language)?.label ?? params.language;
  const diffLabel = certificationLevelsJson.find((l) => l.value === params.difficulty)?.label ?? params.difficulty;

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-primary" />
        <p className="text-lg font-medium">Generando examen...</p>
        <p className="text-sm text-muted-foreground">La IA está creando tu examen</p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <p className="text-sm font-medium text-muted-foreground text-center">
          Parámetros usados
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline">{langLabel}</Badge>
          <Badge variant="outline">{diffLabel}</Badge>
          <Badge variant="outline">{params.questionCount} preguntas</Badge>
          {params.grammarTopics.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
          {params.grammarTopics.length > 3 && (
            <Badge variant="secondary">+{params.grammarTopics.length - 3}</Badge>
          )}
          {params.questionTypes.map((qt) => (
            <Badge key={qt} variant="secondary">
              {QUESTION_TYPE_LABELS[qt]}
            </Badge>
          ))}
          {params.topic.trim() && (
            <Badge variant="secondary">Tema: {params.topic}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
