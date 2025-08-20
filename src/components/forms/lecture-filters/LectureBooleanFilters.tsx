import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LECTURE_BOOLEAN_FILTERS } from "./constants";

interface LectureBooleanFiltersProps {
  values: Record<string, boolean | undefined>;
  onChange: (key: string, value: boolean | undefined) => void;
}

export function LectureBooleanFilters({ values, onChange }: LectureBooleanFiltersProps) {
  const getValue = (key: string) => values[key] ?? undefined;
  
  const toggleValue = (key: string) => {
    const currentValue = getValue(key);
    let newValue: boolean | undefined;
    
    if (currentValue === undefined) {
      newValue = true; // Primera vez: activar
    } else if (currentValue === true) {
      newValue = false; // Segunda vez: desactivar
    } else {
      newValue = undefined; // Tercera vez: reset (todos)
    }
    
    onChange(key, newValue);
  };

  const getLabel = (key: string) => {
    const value = getValue(key);
    if (value === undefined) return "Todos";
    if (value === true) return "Sí";
    return "No";
  };

  const getVariant = (key: string) => {
    const value = getValue(key);
    if (value === undefined) return "outline";
    if (value === true) return "default";
    return "secondary";
  };

  return (
    <div className="space-y-3">
      {LECTURE_BOOLEAN_FILTERS.map((filter) => (
        <div key={filter.value} className="flex items-center space-x-2">
          <Checkbox
            id={filter.value}
            checked={getValue(filter.value) !== undefined}
            onCheckedChange={() => toggleValue(filter.value)}
          />
          <Label htmlFor={filter.value} className="text-sm font-normal cursor-pointer">
            <div className="flex items-center gap-2">
              <span>{filter.label}</span>
              <span className="text-xs text-muted-foreground">
                ({getLabel(filter.value)})
              </span>
            </div>
          </Label>
        </div>
      ))}
    </div>
  );
} 