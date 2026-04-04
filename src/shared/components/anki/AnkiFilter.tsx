import { useState, useEffect, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { wordTypesJson, getWordTypesForLanguage } from "@/data/business/shared";
import type { WordType } from "@/types/business";
import { useAuth } from "@/shared/hooks/useAuth";
import { getWordTypeLabel } from "@/utils/common/wordTypeLabels";

export type DifficultyOption = "easy" | "medium" | "hard";

export interface AnkiFilterValues {
  difficulty: DifficultyOption[];
  limit: number;
  /** Vacío = sin filtrar por tipo (todas) */
  types: WordType[];
}

const DIFFICULTY_LABELS: Record<DifficultyOption, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

export const DEFAULT_FILTERS: AnkiFilterValues = {
  difficulty: ["hard", "medium"],
  limit: 30,
  types: [],
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
  const { user } = useAuth();
  const typeLabelLocale = user?.language;
  const ankiWordTypeOptions = useMemo(() => {
    const allowed = new Set(getWordTypesForLanguage(user?.language ?? "en"));
    return wordTypesJson.filter((wt) => allowed.has(wt.value));
  }, [user?.language]);
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
    setLocalValues({ ...localValues, difficulty: newDifficulty });
  };

  const handleTypeToggle = (t: WordType) => {
    const next = localValues.types.includes(t)
      ? localValues.types.filter((x) => x !== t)
      : [...localValues.types, t];
    setLocalValues({ ...localValues, types: next });
  };

  const handleApplyNormal = () => {
    setLocalValues({ ...localValues, difficulty: ["hard", "medium"] });
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
    const allowedTypes = new Set(getWordTypesForLanguage(user?.language ?? "en"));
    const toApply: AnkiFilterValues = {
      ...localValues,
      limit,
      difficulty: localValues.difficulty.length > 0
        ? localValues.difficulty
        : DEFAULT_FILTERS.difficulty,
      types: localValues.types.filter((t) => allowedTypes.has(t)),
    };
    onChange(toApply);
    onApply?.(toApply);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled} title="Filtros">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="end">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="tipo">Tipo</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-3">
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
          </TabsContent>

          <TabsContent value="tipo" className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Tipos gramaticales (vacío = todos)
            </p>
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {ankiWordTypeOptions.map(({ value }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`anki-type-${value}`}
                    checked={localValues.types.includes(value)}
                    onCheckedChange={() => handleTypeToggle(value)}
                  />
                  <Label
                    htmlFor={`anki-type-${value}`}
                    className="cursor-pointer text-sm font-normal leading-tight"
                  >
                    {getWordTypeLabel(value, typeLabelLocale)}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleApply} className="w-full mt-4">
          Aplicar y cargar
        </Button>
      </PopoverContent>
    </Popover>
  );
}
