import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { GeneratedExam, ValidationResult } from "@/types/models";
import type { IExamQuestion } from "@/types/models";
import { CheckCircle2, RotateCcw, Save, AlertCircle, Loader2, Wrench, FileText } from "lucide-react";
import { languagesJson, certificationLevelsJson } from "@/data/bussiness/shared";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { grammarTopicsJson as enGrammarTopics } from "@/data/bussiness/en";
import { grammarTopicsJson as esGrammarTopics } from "@/data/bussiness/es";
import { grammarTopicsJson as ptGrammarTopics } from "@/data/bussiness/pt";
import { cn } from "@/utils/common/classnames";

const getGrammarTopicsByLanguage = (language: string) => {
  switch (language) {
    case "es":
      return esGrammarTopics;
    case "pt":
      return ptGrammarTopics;
    default:
      return enGrammarTopics;
  }
};

const getTopicLabel = (topics: ReturnType<typeof getGrammarTopicsByLanguage>, value: string): string => {
  for (const cat of topics) {
    const t = cat.children.find((c) => c.value === value);
    if (t) return t.label;
  }
  return value;
};

const QUESTION_TYPE_LABELS: Record<string, string> = {
  multiple: "Opción múltiple",
  unique: "Respuesta única",
  fillInBlank: "Completar huecos",
  translateText: "Traducir texto",
};

interface ExamResultParams {
  language: string;
  difficulty: string;
  grammarTopics: string[];
  questionTypes: string[];
  questionCount: number;
  topic: string;
}

interface ExamResultTabProps {
  exam: GeneratedExam;
  params: ExamResultParams;
  validation?: ValidationResult | null;
  onValidate: () => void;
  onCorrect: () => void;
  onSave: () => void;
  onRegenerate: () => void;
  isValidating: boolean;
  isCorrecting: boolean;
  isSaving: boolean;
}

function QuestionCard({ q, index }: { q: IExamQuestion; index: number }) {
  const hasOptions = q.options && q.options.length > 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Pregunta {index + 1}</CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {QUESTION_TYPE_LABELS[q.type] ?? q.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {q.type === "translateText" ? (
          <>
            <p className="text-xs text-muted-foreground font-medium">Texto a traducir:</p>
            <p className="text-sm">{q.text}</p>
          </>
        ) : (
          <p className="text-sm">{q.text}</p>
        )}
        {hasOptions && (
          <ul className="space-y-1 text-sm">
            {q.options?.map((opt, i) => (
              <li
                key={i}
                className={cn(
                  "pl-2 py-1 rounded",
                  i === q.correctIndex && "bg-primary/10 text-primary font-medium"
                )}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </li>
            ))}
          </ul>
        )}
        {q.type === "translateText" && q.correctAnswer && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Traducción correcta:</span> {q.correctAnswer}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Tema:</span> {q.grammarTopic}
        </p>
      </CardContent>
    </Card>
  );
}

export function ExamResultTab({
  exam,
  params,
  validation,
  onValidate,
  onCorrect,
  onSave,
  onRegenerate,
  isValidating,
  isCorrecting,
  isSaving,
}: ExamResultTabProps) {
  const langLabel = languagesJson.find((l) => l.value === params.language)?.label ?? params.language;
  const diffLabel = certificationLevelsJson.find((l) => l.value === params.difficulty)?.label ?? params.difficulty;
  const grammarTopicsData = getGrammarTopicsByLanguage(params.language);
  const grammarTopicLabels = params.grammarTopics.map((v) => getTopicLabel(grammarTopicsData, v));

  return (
    <div className="space-y-6">
      {/* Título y acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">{exam.title}</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onValidate}
            disabled={isValidating}
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Verificar
          </Button>
          {validation && !validation.thumbsUp && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCorrect}
              disabled={isCorrecting}
            >
              {isCorrecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wrench className="h-4 w-4 mr-2" />
              )}
              Corregir con IA
            </Button>
          )}
          <Button size="sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Guardar
          </Button>
          <Button variant="ghost" size="sm" onClick={onRegenerate}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Volver a generar
          </Button>
        </div>
      </div>

      {/* Detalle del examen */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3">
        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
        <Badge variant="secondary" className="font-normal">
          Nivel: {diffLabel}
        </Badge>
        <Badge variant="secondary" className="font-normal">
          {exam.questions.length} preguntas
        </Badge>
        <Badge variant="secondary" className="font-normal">
          Idioma: {langLabel}
        </Badge>
        {params.grammarTopics.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="font-normal cursor-help">
                  {params.grammarTopics.length} tema{params.grammarTopics.length > 1 ? "s" : ""} gramática
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-medium mb-1">Temas:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  {grammarTopicLabels.map((label, i) => (
                    <li key={i}>{label}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {params.topic.trim() && (
          <Badge variant="outline" className="font-normal">
            Tema: {params.topic}
          </Badge>
        )}
      </div>

      {/* Validación */}
      {validation && (
        <Card className={validation.thumbsUp ? "border-green-500/50" : "border-amber-500/50"}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {validation.thumbsUp ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              Validación: {validation.thumbsUp ? "Aprobado" : "Revisar"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{validation.feedback}</p>
            {validation.issues?.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {validation.issues.map((issue, i) => (
                  <li key={i}>
                    P{issue.questionIndex + 1}: {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de preguntas */}
      <ScrollArea className="h-[50vh] sm:h-[60vh] pr-4">
        <div className="space-y-4 pb-4">
          {exam.questions.map((q, i) => (
            <QuestionCard key={i} q={q} index={i} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
