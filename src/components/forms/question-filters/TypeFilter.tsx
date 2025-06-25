import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { questionTypes } from "@/data/questionTypes";

interface TypeFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export function TypeFilter({ value, onChange }: TypeFilterProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tipo de Pregunta</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid grid-cols-1 gap-2">
          {questionTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={`type-${type.value}`} />
              <Label htmlFor={`type-${type.value}`} className="text-sm">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
} 