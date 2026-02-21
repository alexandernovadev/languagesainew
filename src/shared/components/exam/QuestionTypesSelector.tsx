import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { ExamQuestionType } from "@/types/models";
import { cn } from "@/utils/common/classnames";

const QUESTION_TYPE_OPTIONS: { value: ExamQuestionType; label: string }[] = [
  { value: "multiple", label: "Opción múltiple" },
  { value: "unique", label: "Respuesta única" },
  { value: "fillInBlank", label: "Completar huecos" },
  { value: "translateText", label: "Traducir texto" },
];

interface QuestionTypesSelectorProps {
  selected: ExamQuestionType[];
  onChange: (selected: ExamQuestionType[]) => void;
}

export function QuestionTypesSelector({ selected, onChange }: QuestionTypesSelectorProps) {
  const toggle = (value: ExamQuestionType) => {
    if (selected.includes(value)) {
      if (selected.length <= 1) return; // Mínimo 1 tipo
      onChange(selected.filter((t) => t !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Tipos de pregunta</Label>
      <p className="text-xs text-muted-foreground">
        Selecciona al menos un tipo (se distribuirán en el examen)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUESTION_TYPE_OPTIONS.map((opt) => (
          <div
            key={opt.value}
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg border transition-colors",
              selected.includes(opt.value) && "border-primary bg-primary/5"
            )}
          >
            <Checkbox
              id={`qtype-${opt.value}`}
              checked={selected.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            />
            <label
              htmlFor={`qtype-${opt.value}`}
              className="text-sm font-medium cursor-pointer flex-1"
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
