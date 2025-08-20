import { Badge } from "@/components/ui/badge";
import { EXPRESSION_LEVELS } from "./constants";

interface LevelFilterProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

export function LevelFilter({ value = [], onChange }: LevelFilterProps) {
  const handleToggle = (level: string) => {
    const newValue = value.includes(level)
      ? value.filter((v) => v !== level)
      : [...value, level];
    onChange(newValue);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {EXPRESSION_LEVELS.map((level) => (
        <Badge
          key={level.value}
          variant={value.includes(level.value) ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => handleToggle(level.value)}
        >
          {level.label}
        </Badge>
      ))}
    </div>
  );
}
