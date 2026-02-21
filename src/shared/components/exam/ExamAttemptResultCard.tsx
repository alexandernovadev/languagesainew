import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { MarkdownRenderer } from "@/shared/components/ui/markdown-renderer";
import type { IAttemptQuestion } from "@/types/models";
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { cn } from "@/utils/common/classnames";

interface ExamAttemptResultCardProps {
  aq: IAttemptQuestion;
  index: number;
}

export function ExamAttemptResultCard({ aq, index }: ExamAttemptResultCardProps) {
  const hasOptions = aq.options && aq.options.length > 0;
  const userAnswerIndex = typeof aq.userAnswer === "number" ? aq.userAnswer : -1;
  const correctIndex = aq.correctIndex ?? -1;
  const userAnswerDisplay = hasOptions
    ? aq.options![userAnswerIndex]
    : String(aq.userAnswer || "—");
  const correctAnswerDisplay = hasOptions
    ? aq.options![correctIndex]
    : String(aq.correctAnswer ?? "—");

  return (
    <Card className="overflow-hidden border-white">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-base font-semibold leading-tight">
              Pregunta {index + 1}
            </CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {aq.questionText}
            </p>
          </div>
          <Badge variant={aq.isCorrect ? "emerald" : "destructive"} className="shrink-0">
            {aq.isCorrect ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Correcta
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Incorrecta
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {hasOptions ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Opciones
            </p>
            <ul className="space-y-1.5">
              {aq.options!.map((opt, i) => {
                const isSelected = i === userAnswerIndex;
                const isCorrect = i === correctIndex;
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
                        <Badge variant="emerald">correcta</Badge>
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
      </CardContent>
    </Card>
  );
}
