import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface StatusFilterProps {
  value?: string; // comma-separated list or "all"
  onChange: (value: string | undefined) => void;
}

const statusOptions = [
  { value: "in_progress", label: "En progreso" },
  { value: "submitted", label: "Enviado" },
  { value: "graded", label: "Calificado" },
  { value: "abandoned", label: "Abandonado" },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const selected = value && value !== "all" ? value.split(",") : [];

  const handleClick = (status: string) => {
    const isSelected = selected.includes(status);
    const newValues = isSelected
      ? selected.filter((s) => s !== status)
      : [...selected, status];

    if (newValues.length === 0) {
      onChange("all");
    } else {
      onChange(newValues.join(","));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Estado</Label>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <Badge
              key={opt.value}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleClick(opt.value)}
            >
              {opt.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 