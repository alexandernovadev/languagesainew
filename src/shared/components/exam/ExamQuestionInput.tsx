import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { IExamQuestion } from "@/types/models";
import { cn } from "@/utils/common/classnames";

const QUESTION_TYPE_LABELS: Record<string, string> = {
  multiple: "Opción múltiple",
  unique: "Respuesta única",
  fillInBlank: "Completar huecos",
  translateText: "Traducir texto",
};

interface ExamQuestionInputProps {
  question: IExamQuestion;
  index: number;
  value: number | string | number[] | null;
  onChange: (value: number | string | number[]) => void;
}

export function ExamQuestionInput({ question: q, index, value, onChange }: ExamQuestionInputProps) {
  const hasOptions = q.options && q.options.length > 0;
  const isMultipleSelect = q.type === "multiple" && hasOptions;
  const isSingleSelect =
    (q.type === "unique" && hasOptions) || (q.type === "fillInBlank" && hasOptions);

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
      <CardContent className="space-y-4">
        {q.type === "translateText" ? (
          <>
            <p className="text-xs text-muted-foreground font-medium">Texto a traducir:</p>
            <p className="text-sm">{q.text}</p>
          </>
        ) : (
          <p className="text-sm">{q.text}</p>
        )}

        {isMultipleSelect && hasOptions && (
          <div className="space-y-2">
            {q.options!.map((opt, i) => {
              const selected = Array.isArray(value) ? value.includes(i) : false;
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors",
                    selected && "border-primary bg-primary/5"
                  )}
                  onClick={() => {
                    const current = Array.isArray(value) ? [...value] : [];
                    const next = current.includes(i)
                      ? current.filter((x) => x !== i)
                      : [...current, i].sort((a, b) => a - b);
                    onChange(next);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const current = Array.isArray(value) ? [...value] : [];
                      const next = current.includes(i)
                        ? current.filter((x) => x !== i)
                        : [...current, i].sort((a, b) => a - b);
                      onChange(next);
                    }
                  }}
                >
                  <Checkbox
                    id={`q${index}-opt${i}`}
                    checked={selected}
                    tabIndex={-1}
                    className="pointer-events-none"
                  />
                  <Label
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </Label>
                </div>
              );
            })}
          </div>
        )}

        {isSingleSelect && hasOptions && (
          <RadioGroup
            value={typeof value === "number" ? String(value) : ""}
            onValueChange={(v) => onChange(parseInt(v, 10))}
            className="space-y-2"
          >
            {q.options!.map((opt, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors",
                  value === i && "border-primary bg-primary/5"
                )}
                onClick={() => onChange(i)}
              >
                <RadioGroupItem value={String(i)} id={`q${index}-opt${i}`} />
                <Label
                  htmlFor={`q${index}-opt${i}`}
                  className="flex-1 cursor-pointer text-sm font-normal"
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {!isMultipleSelect && !isSingleSelect && (
          <div className="space-y-2">
            <Label htmlFor={`q${index}-input`} className="text-sm font-medium">
              Tu respuesta
            </Label>
            <Input
              id={`q${index}-input`}
              type="text"
              value={value != null ? String(value) : ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Escribe aquí..."
              className="min-h-[44px]"
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Tema:</span> {q.grammarTopic}
        </p>
      </CardContent>
    </Card>
  );
}
