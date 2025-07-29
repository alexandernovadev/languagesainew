import { Badge } from "@/components/ui/badge";
import { LECTURE_TYPES } from "./constants";

interface TypeWriteFilterProps {
  value?: string; // comma separated values
  onChange: (value: string | undefined) => void;
}

export function TypeWriteFilter({ value, onChange }: TypeWriteFilterProps) {
  const selected = value ? value.split(",") : [];

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      const newVals = selected.filter((v) => v !== val);
      onChange(newVals.length ? newVals.join(",") : undefined);
    } else {
      const newVals = [...selected, val];
      onChange(newVals.join(","));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {LECTURE_TYPES.map((t) => {
        const isSel = selected.includes(t.value);
        return (
          <Badge
            key={t.value}
            variant={isSel ? "default" : "outline"}
            className={`cursor-pointer transition-all ${isSel ? "hover:shadow-lg hover:shadow-primary/20 hover:scale-105" : "hover:bg-primary/10"}`}
            onClick={() => toggle(t.value)}
          >
            {t.label}
          </Badge>
        );
      })}
    </div>
  );
} 