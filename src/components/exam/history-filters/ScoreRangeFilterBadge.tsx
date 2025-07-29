import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ScoreRangeFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const options = [
  { value: "excellent", label: "Excelente (90%+)" },
  { value: "good", label: "Bueno (80-89%)" },
  { value: "average", label: "Promedio (60-79%)" },
  { value: "poor", label: "Bajo (<60%)" },
];

export function ScoreRangeFilterBadge({ value, onChange }: ScoreRangeFilterProps) {
  const selected = value && value !== "all" ? value.split(",") : [];

  const toggle = (val: string) => {
    const isSelected = selected.includes(val);
    const newVals = isSelected ? selected.filter((v) => v !== val) : [...selected, val];
    onChange(newVals.length === 0 ? "all" : newVals.join(","));
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Rango de Puntuación</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSel = selected.includes(opt.value);
          return (
            <Badge
              key={opt.value}
              variant={isSel ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSel ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105" : "hover:bg-primary/10"
              }`}
              onClick={() => toggle(opt.value)}
            >
              {opt.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 