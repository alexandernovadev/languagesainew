import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EXPRESSION_TYPES } from "./constants";

interface TypeFilterProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

export function TypeFilter({ value = [], onChange }: TypeFilterProps) {
  const handleToggle = (type: string) => {
    const newValue = value.includes(type)
      ? value.filter((v) => v !== type)
      : [...value, type];
    onChange(newValue);
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Tipos de Expresión</Label>
        {value.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {EXPRESSION_TYPES.map((type) => (
          <div key={type.value} className="flex items-center space-x-2">
            <Checkbox
              id={type.value}
              checked={value.includes(type.value)}
              onCheckedChange={() => handleToggle(type.value)}
            />
            <Label
              htmlFor={type.value}
              className="text-sm font-normal cursor-pointer"
            >
              {type.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
