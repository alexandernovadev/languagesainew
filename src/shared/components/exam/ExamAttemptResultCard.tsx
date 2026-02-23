import { Badge } from "@/shared/components/ui/badge";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import type { IAttemptQuestion } from "@/types/models";
import { CheckCircle2, XCircle, MessageSquare, MinusCircle } from "lucide-react";
import { cn } from "@/utils/common/classnames";

const QUESTION_TYPE_LABELS: Record<string, string> = {
  multiple: "Opción múltiple",
  unique: "Respuesta única",
  fillInBlank: "Completar huecos",
  translateText: "Traducir",
};

interface ExamAttemptResultCardProps {
  aq: IAttemptQuestion;
  index: number;
}

export function ExamAttemptResultCard({ aq, index }: ExamAttemptResultCardProps) {
  const hasOptions = aq.options && aq.options.length > 0;
  const isMultipleSelect = aq.questionType === "multiple" && hasOptions;
  const userAnswerIndices = Array.isArray(aq.userAnswer)
    ? aq.userAnswer
    : typeof aq.userAnswer === "number"
      ? [aq.userAnswer]
      : [];
  const correctIndices = aq.correctIndices ?? (aq.correctIndex != null ? [aq.correctIndex] : []);
  const correctIndex = aq.correctIndex ?? -1;
  const userAnswerDisplay = hasOptions
    ? isMultipleSelect
      ? userAnswerIndices.map((i) => aq.options![i]).filter(Boolean).join(", ") || "—"
      : aq.options![userAnswerIndices[0] ?? -1] ?? "—"
    : String(aq.userAnswer || "—");
  const correctAnswerDisplay = hasOptions
    ? isMultipleSelect
      ? correctIndices.map((i) => aq.options![i]).filter(Boolean).join(", ") || "—"
      : aq.options![correctIndex] ?? "—"
    : String(aq.correctAnswer ?? "—");

  const isPartial = aq.isPartial === true;

  return (
    <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold leading-tight">
              Pregunta {index + 1}
            </h3>
              <span className="text-muted-foreground">|</span>
              <Badge variant="outline" className="text-xs">
                {QUESTION_TYPE_LABELS[aq.questionType] ?? aq.questionType}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {aq.questionText}
            </p>
          </div>
          <Badge
            variant={
              aq.isCorrect ? "emerald" : isPartial ? "secondary" : "destructive"
            }
            className="shrink-0"
          >
            {aq.isCorrect ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Correcta
              </>
            ) : isPartial ? (
              <>
                <MinusCircle className="h-3.5 w-3.5 mr-1" />
                Parcial ({aq.partialScore}%)
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Incorrecta
              </>
            )}
          </Badge>
      </div>
      <div className="space-y-4">
        {hasOptions ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Opciones
            </p>
            <ul className="space-y-1.5">
              {aq.options!.map((opt, i) => {
                const isSelected = isMultipleSelect ? userAnswerIndices.includes(i) : i === userAnswerIndices[0];
                const isCorrect = isMultipleSelect ? correctIndices.includes(i) : i === correctIndex;
                return (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm border",
                      isSelected && isCorrect && "bg-emerald-500/10 border-emerald-500/30",
                      isSelected && !isCorrect && "bg-red-500/10 border-red-500/30",
                      !isSelected && isCorrect && "bg-emerald-500/5 border-emerald-500/20",
                      !isSelected && !isCorrect && "border-gray-300 dark:border-gray-600"
                    )}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + i)}. {opt}
                    </span>
                    <span className="flex gap-1.5 shrink-0">
                      {isSelected && (
                        <Badge variant="blue">seleccionada</Badge>
                      )}
                      {isCorrect && (
                        <Badge variant="emerald">✓</Badge>
                      )}
                      {isSelected && !isCorrect && (
                        <Badge variant="destructive">✗</Badge>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Tu respuesta
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  aq.isCorrect
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isPartial
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-red-600 dark:text-red-400"
                )}
              >
                {userAnswerDisplay}
              </p>
            </div>
            {!aq.isCorrect && (
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Respuesta correcta
                </p>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {correctAnswerDisplay}
                </p>
              </div>
            )}
          </div>
        )}

        {aq.aiFeedback && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Feedback IA
              </p>
            </div>
            <MarkdownRenderer
              content={aq.aiFeedback}
              variant="chat"
              className="text-sm [&_ul]:mt-2 [&_ol]:mt-2 [&_blockquote]:mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
