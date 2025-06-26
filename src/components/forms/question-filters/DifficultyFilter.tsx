import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { questionDifficulties } from "@/data/questionTypes";

interface DifficultyFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function DifficultyFilter({ value, onChange }: DifficultyFilterProps) {
  const selectedDifficulties = value ? value.split(",") : [];

  const handleDifficultyClick = (difficultyValue: string) => {
    if (selectedDifficulties.includes(difficultyValue)) {
      // Remover dificultad
      const newDifficulties = selectedDifficulties.filter(
        (d) => d !== difficultyValue
      );
      onChange(
        newDifficulties.length > 0 ? newDifficulties.join(",") : undefined
      );
    } else {
      // Agregar dificultad
      const newDifficulties = [...selectedDifficulties, difficultyValue];
      onChange(newDifficulties.join(","));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Nivel de Dificultad</Label>
      <div className="flex flex-wrap gap-2">
        {questionDifficulties.map((difficulty) => {
          const isSelected = selectedDifficulties.includes(
            difficulty.value.toString()
          );
          return (
            <Badge
              key={difficulty.value}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => handleDifficultyClick(difficulty.value.toString())}
            >
              {difficulty.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
