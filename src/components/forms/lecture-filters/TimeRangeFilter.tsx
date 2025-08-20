import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeRangeFilterProps {
  timeMin?: number;
  timeMax?: number;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
}

export function TimeRangeFilter({ timeMin, timeMax, onMinChange, onMaxChange }: TimeRangeFilterProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="timeMin" className="text-sm font-medium">
          Tiempo mínimo (minutos)
        </Label>
        <Input
          id="timeMin"
          type="number"
          min="0"
          placeholder="0"
          value={timeMin || ""}
          onChange={(e) => {
            const value = e.target.value;
            onMinChange(value ? parseInt(value) : undefined);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeMax" className="text-sm font-medium">
          Tiempo máximo (minutos)
        </Label>
        <Input
          id="timeMax"
          type="number"
          min="0"
          placeholder="60"
          value={timeMax || ""}
          onChange={(e) => {
            const value = e.target.value;
            onMaxChange(value ? parseInt(value) : undefined);
          }}
        />
      </div>
    </div>
  );
} 