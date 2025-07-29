import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { getAllExamLevels } from "@/utils/common/examTypes";

interface ExamLevelFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function ExamLevelFilter({ value, onChange }: ExamLevelFilterProps) {
  const selectedLevels = value && value !== "all" ? value.split(",") : [];

  const handleLevelClick = (levelValue: string) => {
    if (selectedLevels.includes(levelValue)) {
      // Remover nivel
      const newLevels = selectedLevels.filter((l) => l !== levelValue);
      onChange(newLevels.length > 0 ? newLevels.join(",") : "all");
    } else {
      // Agregar nivel
      const newLevels = [...selectedLevels, levelValue];
      onChange(newLevels.join(","));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Nivel CEFR</Label>
      <div className="flex flex-wrap gap-2">
        {getAllExamLevels().map((level) => {
          const isSelected = selectedLevels.includes(level.value);
          return (
            <Badge
              key={level.value}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleLevelClick(level.value)}
            >
              {level.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
} 