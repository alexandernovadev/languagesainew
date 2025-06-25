import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { questionDifficulties } from "@/data/questionTypes";

interface DifficultyFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export function DifficultyFilter({ value, onChange }: DifficultyFilterProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Nivel de Dificultad</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid grid-cols-1 gap-2">
          {questionDifficulties.map((difficulty) => (
            <div key={difficulty.value} className="flex items-center space-x-2">
              <RadioGroupItem value={difficulty.value.toString()} id={`difficulty-${difficulty.value}`} />
              <Label htmlFor={`difficulty-${difficulty.value}`} className="text-sm">
                {difficulty.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
} 