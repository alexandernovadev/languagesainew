import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  value?: string; // comma-separated or "all"
  onChange: (value: string | undefined) => void;
}

const options = [
  { value: "today", label: "Hoy" },
  { value: "week", label: "Última semana" },
  { value: "month", label: "Último mes" },
  { value: "year", label: "Último año" },
];

export function DateRangeFilterBadge({ value, onChange }: DateRangeFilterProps) {
  const selected = value && value !== "all" ? value.split(",") : [];

  const handleClick = (val: string) => {
    const isSelected = selected.includes(val);
    const newVals = isSelected ? selected.filter((v) => v !== val) : [...selected, val];

    if (newVals.length === 0) onChange("all");
    else onChange(newVals.join(","));
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Rango de Fecha</Label>
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