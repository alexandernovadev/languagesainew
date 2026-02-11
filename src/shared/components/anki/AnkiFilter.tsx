import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export type DifficultyOption = "easy" | "medium" | "hard";

export interface AnkiFilterValues {
  difficulty: DifficultyOption[];
  limit: number;
}

const DIFFICULTY_LABELS: Record<DifficultyOption, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

export const DEFAULT_FILTERS: AnkiFilterValues = {
  difficulty: ["hard", "medium"],
  limit: 30,
};

interface AnkiFilterProps {
  values: AnkiFilterValues;
  onChange: (values: AnkiFilterValues) => void;
  onApply?: (values: AnkiFilterValues) => void;
  disabled?: boolean;
}

export function AnkiFilter({
  values,
  onChange,
  onApply,
  disabled = false,
}: AnkiFilterProps) {
  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState<AnkiFilterValues>(values);
  const [limitInput, setLimitInput] = useState(values.limit.toString());

  useEffect(() => {
    if (open) {
      setLocalValues(values);
      setLimitInput(values.limit.toString());
    }
  }, [open, values]);

  const handleDifficultyToggle = (d: DifficultyOption) => {
    const newDifficulty = localValues.difficulty.includes(d)
      ? localValues.difficulty.filter((x) => x !== d)
      : [...localValues.difficulty, d];
    const newValues = { ...localValues, difficulty: newDifficulty };
    setLocalValues(newValues);
  };

  const handleApplyNormal = () => {
    const newValues = { ...localValues, difficulty: ["hard", "medium"] };
    setLocalValues(newValues);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLimitInput(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && raw.trim() !== "") {
      const limit = Math.min(100, Math.max(1, parsed));
      setLocalValues((prev) => ({ ...prev, limit }));
    }
  };

  const handleApply = () => {
    const parsed = parseInt(limitInput, 10);
    const limit = !isNaN(parsed) && limitInput.trim() !== ""
      ? Math.min(100, Math.max(1, parsed))
      : 30;
    const toApply: AnkiFilterValues = {
      ...localValues,
      limit,
      difficulty: localValues.difficulty.length > 0
        ? localValues.difficulty
        : DEFAULT_FILTERS.difficulty,
    };
    onChange(toApply);
    onApply?.(toApply);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Dificultad</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleApplyNormal}
              >
                Normal (Medio + Difícil)
              </Button>
            </div>
            <div className="space-y-2">
              {(["easy", "medium", "hard"] as DifficultyOption[]).map((d) => (
                <div key={d} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${d}`}
                    checked={localValues.difficulty.includes(d)}
                    onCheckedChange={() => handleDifficultyToggle(d)}
                  />
                  <Label
                    htmlFor={`difficulty-${d}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {DIFFICULTY_LABELS[d]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="anki-limit" className="font-medium">
              Número de tarjetas
            </Label>
            <Input
              id="anki-limit"
              type="number"
              min={1}
              max={100}
              value={limitInput}
              onChange={handleLimitChange}
              className="mt-2"
            />
          </div>

          <Button onClick={handleApply} className="w-full">
            Aplicar y cargar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
