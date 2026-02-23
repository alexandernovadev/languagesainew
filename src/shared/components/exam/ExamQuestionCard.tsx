import { Badge } from "@/shared/components/ui/badge";
import type { IExamQuestion } from "@/types/models";
import { cn } from "@/utils/common/classnames";

const QUESTION_TYPE_LABELS: Record<string, string> = {
  multiple: "Opción múltiple",
  unique: "Respuesta única",
  fillInBlank: "Completar huecos",
  translateText: "Traducir texto",
};

interface ExamQuestionCardProps {
  question: IExamQuestion;
  index: number;
}

export function ExamQuestionCard({ question: q, index }: ExamQuestionCardProps) {
  const hasOptions = q.options && q.options.length > 0;

  return (
    <div className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Pregunta {index + 1}</h3>
        <Badge variant="outline" className="text-xs shrink-0">
          {QUESTION_TYPE_LABELS[q.type] ?? q.type}
        </Badge>
      </div>
      <div className="space-y-3">
        {q.type === "translateText" ? (
          <>
            <p className="text-xs text-muted-foreground font-medium">Texto a traducir:</p>
            <p className="text-sm">{q.text}</p>
          </>
        ) : (
          <p className="text-sm">{q.text}</p>
        )}
        {hasOptions && (
          <ul className="space-y-1.5 text-sm">
            {q.options?.map((opt, i) => (
              <li
                key={i}
                className={cn(
                  "pl-3 py-2 rounded-md border border-gray-300 dark:border-gray-600",
                  (q.correctIndices?.includes(i) ?? i === q.correctIndex) && "bg-primary/10 text-primary font-medium"
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
      </div>
    </div>
  );
}
