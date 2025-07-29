import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LECTURE_BOOLEAN_FILTERS } from "./constants";

interface LectureBooleanFiltersProps {
  values: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
}

export function LectureBooleanFilters({ values, onChange }: LectureBooleanFiltersProps) {
  return (
    <div className="space-y-3">
      {LECTURE_BOOLEAN_FILTERS.map((f) => (
        <div key={f.value} className="flex items-center space-x-2">
          <Checkbox
            id={f.value}
            checked={values[f.value] || false}
            onCheckedChange={(chk) => onChange(f.value, chk as boolean)}
          />
          <Label htmlFor={f.value} className="text-sm font-normal cursor-pointer">
            {f.label}
          </Label>
        </div>
      ))}
    </div>
  );
} 