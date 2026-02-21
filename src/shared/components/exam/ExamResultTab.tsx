import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ExamPreview } from "./ExamPreview";
import type { GeneratedExam, ValidationResult } from "@/types/models";
import type { ExamDetailMeta } from "./ExamDetailBar";
import { CheckCircle2, RotateCcw, Save, AlertCircle, Loader2, Wrench } from "lucide-react";

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
  const meta: ExamDetailMeta = {
    language: params.language,
    difficulty: params.difficulty,
    grammarTopics: params.grammarTopics,
    topic: params.topic,
  };

  const examPreviewData = {
    title: exam.title,
    questions: exam.questions,
  };

  const validationCard = validation && (
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
  );

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={onValidate} disabled={isValidating}>
        {isValidating ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4 mr-2" />
        )}
        Verificar
      </Button>
      {validation && !validation.thumbsUp && (
        <Button variant="outline" size="sm" onClick={onCorrect} disabled={isCorrecting}>
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
    </>
  );

  return (
    <ExamPreview
      exam={examPreviewData}
      meta={meta}
      actions={actions}
      middleContent={validationCard}
      scrollHeight="50vh"
    />
  );
}
