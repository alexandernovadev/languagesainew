import { Badge } from "@/components/ui/badge";
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
        <div key={filter.value} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{filter.label}</span>
            <Badge 
              variant={getVariant(filter.value) as any}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleValue(filter.value)}
            >
              {getLabel(filter.value)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
} 