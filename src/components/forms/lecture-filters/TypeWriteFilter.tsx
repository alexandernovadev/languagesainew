import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LECTURE_TYPES } from "./constants";
import { X } from "lucide-react";

interface TypeWriteFilterProps {
  value?: string; // comma separated values
  onChange: (value: string | undefined) => void;
}

export function TypeWriteFilter({ value, onChange }: TypeWriteFilterProps) {
  const selected = value ? value.split(",") : [];

  const handleTypeToggle = (typeValue: string, checked: boolean) => {
    if (checked) {
      const newTypes = [...selected, typeValue];
      onChange(newTypes.join(","));
    } else {
      const newTypes = selected.filter((t) => t !== typeValue);
      onChange(newTypes.length > 0 ? newTypes.join(",") : undefined);
    }
  };

  const clearAll = () => {
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-4">
        {LECTURE_TYPES.map((type) => (
          <div key={type.value} className="flex items-center gap-2">
            <Checkbox
              id={type.value}
              checked={selected.includes(type.value)}
              onCheckedChange={(checked) =>
                handleTypeToggle(type.value, checked as boolean)
              }
            />
            <Label htmlFor={type.value} className="cursor-pointer">
              <div className="text-sm leading-tight">{type.label}</div>
            </Label>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-auto px-2 py-1 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        </div>
      )}
    </div>
  );
} 