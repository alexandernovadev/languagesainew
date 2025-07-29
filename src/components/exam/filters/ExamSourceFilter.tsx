import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ExamSourceFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const examSources = [
  { value: "manual", label: "Manual" },
  { value: "ai", label: "Generado por IA" },
];

export function ExamSourceFilter({ value, onChange }: ExamSourceFilterProps) {
  const selectedSources = value && value !== "all" ? value.split(",") : [];

  const handleSourceClick = (sourceValue: string) => {
    if (selectedSources.includes(sourceValue)) {
      // Remover origen
      const newSources = selectedSources.filter((s) => s !== sourceValue);
      onChange(newSources.length > 0 ? newSources.join(",") : "all");
    } else {
      // Agregar origen
      const newSources = [...selectedSources, sourceValue];
      onChange(newSources.join(","));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Origen</Label>
      <div className="flex flex-wrap gap-2">
        {examSources.map((source) => {
          const isSelected = selectedSources.includes(source.value);
          return (
            <Badge
              key={source.value}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleSourceClick(source.value)}
            >
              {source.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 