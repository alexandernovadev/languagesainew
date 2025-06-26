import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BOOLEAN_FILTERS } from "./constants";

interface BooleanFiltersProps {
  values: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
}

export function BooleanFilters({ values, onChange }: BooleanFiltersProps) {
  return (
    <div className="space-y-3">
      {BOOLEAN_FILTERS.map((filter) => (
        <div key={filter.value} className="flex items-center space-x-2">
          <Checkbox
            id={filter.value}
            checked={values[filter.value] || false}
            onCheckedChange={(checked) =>
              onChange(filter.value, checked as boolean)
            }
          />
          <Label
            htmlFor={filter.value}
            className="text-sm font-normal cursor-pointer"
          >
            {filter.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
