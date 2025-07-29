import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ExamTypeFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const examTypes = [
  { value: "true", label: "Adaptativo" },
  { value: "false", label: "No Adaptativo" },
];

export function ExamTypeFilter({ value, onChange }: ExamTypeFilterProps) {
  const selectedTypes = value && value !== "all" ? value.split(",") : [];

  const handleTypeClick = (typeValue: string) => {
    if (selectedTypes.includes(typeValue)) {
      // Remover tipo
      const newTypes = selectedTypes.filter((t) => t !== typeValue);
      onChange(newTypes.length > 0 ? newTypes.join(",") : "all");
    } else {
      // Agregar tipo
      const newTypes = [...selectedTypes, typeValue];
      onChange(newTypes.join(","));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tipo de Examen</Label>
      <div className="flex flex-wrap gap-2">
        {examTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.value);
          return (
            <Badge
              key={type.value}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleTypeClick(type.value)}
            >
              {type.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 