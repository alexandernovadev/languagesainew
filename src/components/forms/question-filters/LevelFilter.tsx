import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { questionLevels } from "@/data/questionTypes";

interface LevelFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export function LevelFilter({ value, onChange }: LevelFilterProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Nivel CEFR</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid grid-cols-1 gap-2">
          {questionLevels.map((level) => (
            <div key={level.value} className="flex items-center space-x-2">
              <RadioGroupItem value={level.value} id={`level-${level.value}`} />
              <Label htmlFor={`level-${level.value}`} className="text-sm">
                {level.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
} 