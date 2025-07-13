import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LectureGeneratorConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialConfig: {
    level: string;
    typeWrite: string;
    difficulty: string;
    addEasyWords: boolean;
    language?: string;
    rangeMin?: number;
    rangeMax?: number;
  };
  onSave: (config: {
    level: string;
    typeWrite: string;
    difficulty: string;
    addEasyWords: boolean;
    language: string;
    rangeMin: number;
    rangeMax: number;
  }) => void;
  lectureLevels: { value: string; label: string }[];
  lectureTypes: { value: string; label: string }[];
}

const LANG_OPTIONS = [
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
  { value: "pt", label: "Portugués" },
];

export const LectureGeneratorConfigModal: React.FC<
  LectureGeneratorConfigModalProps
> = ({
  open,
  onOpenChange,
  initialConfig,
  onSave,
  lectureLevels,
  lectureTypes,
}) => {
  const [tempConfig, setTempConfig] = useState({
    ...initialConfig,
    language: initialConfig.language || "es",
    rangeMin: initialConfig.rangeMin ?? 5200,
    rangeMax: initialConfig.rangeMax ?? 6500,
  });
  const [rangeError, setRangeError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTempConfig({
        ...initialConfig,
        language: initialConfig.language || "es",
        rangeMin: initialConfig.rangeMin ?? 5200,
        rangeMax: initialConfig.rangeMax ?? 6500,
      });
      setRangeError(null);
    }
    // eslint-disable-next-line
  }, [open]);

  const handleSave = () => {
    if (tempConfig.rangeMin > tempConfig.rangeMax) {
      setRangeError("El mínimo debe ser menor o igual al máximo");
      return;
    }
    setRangeError(null);
    onSave(tempConfig as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl md:max-w-3xl p-0  border-0 shadow-2xl">
        <DialogHeader className="sticky top-0 z-10  px-8 pt-8 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Configuración avanzada
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Ajusta los parámetros de la lectura generada.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-y-auto px-8 py-6 space-y-8">
          {/* Sección 1: Idioma y Nivel */}
          <div>
            <div className="mb-2 text-lg font-semibold text-primary">
              Idioma y Nivel
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Idioma */}
              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={tempConfig.language}
                  onValueChange={(v) =>
                    setTempConfig((c) => ({ ...c, language: v }))
                  }
                >
                  <SelectTrigger
                    id="language"
                    className="w-full mt-1 rounded-lg border px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                  >
                    <SelectValue placeholder="Selecciona el idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANG_OPTIONS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Nivel */}
              <div>
                <Label htmlFor="level">Nivel</Label>
                <Select
                  value={tempConfig.level}
                  onValueChange={(v) =>
                    setTempConfig((c) => ({ ...c, level: v }))
                  }
                >
                  <SelectTrigger
                    id="level"
                    className="w-full mt-1 rounded-lg border px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                  >
                    <SelectValue placeholder="Selecciona el nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {lectureLevels.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <hr className="border-b border-border/40" />
          {/* Sección 2: Tipo y Dificultad */}
          <div>
            <div className="mb-2 text-lg font-semibold text-primary">
              Tipo y Dificultad
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo */}
              <div>
                <Label htmlFor="typeWrite">Tipo de texto</Label>
                <Select
                  value={tempConfig.typeWrite}
                  onValueChange={(v) =>
                    setTempConfig((c) => ({ ...c, typeWrite: v }))
                  }
                >
                  <SelectTrigger
                    id="typeWrite"
                    className="w-full mt-1 rounded-lg border px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                  >
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {lectureTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Dificultad */}
              <div>
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select
                  value={tempConfig.difficulty}
                  onValueChange={(v) =>
                    setTempConfig((c) => ({ ...c, difficulty: v }))
                  }
                >
                  <SelectTrigger
                    id="difficulty"
                    className="w-full mt-1 rounded-lg border px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                  >
                    <SelectValue placeholder="Selecciona la dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <hr className="border-b border-border/40" />
          {/* Sección 3: Opciones adicionales */}
          <div>
            <div className="mb-2 text-lg font-semibold text-primary">
              Opciones adicionales
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Vocabulario adicional */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="addEasyWords"
                  checked={tempConfig.addEasyWords}
                  onCheckedChange={(v) =>
                    setTempConfig((c) => ({ ...c, addEasyWords: !!v }))
                  }
                />
                <Label htmlFor="addEasyWords">
                  Incluir vocabulario adicional fácil
                </Label>
              </div>
            </div>
          </div>
          <hr className="border-b border-border/40" />
          {/* Sección 4: Longitud */}
          <div>
            <div className="mb-2 text-lg font-semibold text-primary">
              Longitud de la lectura
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Longitud mínima */}
              <div>
                <Label htmlFor="rangeMin">Longitud mínima (caracteres)</Label>
                <input
                  id="rangeMin"
                  type="number"
                  min={100}
                  max={100000}
                  className="input w-full mt-1 border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                  value={tempConfig.rangeMin}
                  onChange={(e) =>
                    setTempConfig((c) => ({
                      ...c,
                      rangeMin: Number(e.target.value),
                    }))
                  }
                />
              </div>
              {/* Longitud máxima */}
              <div>
                <Label htmlFor="rangeMax">Longitud máxima (caracteres)</Label>
                <input
                  id="rangeMax"
                  type="number"
                  min={100}
                  max={100000}
                  className="input w-full mt-1 border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                  value={tempConfig.rangeMax}
                  onChange={(e) =>
                    setTempConfig((c) => ({
                      ...c,
                      rangeMax: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            {rangeError && (
              <div className="text-red-500 text-xs mt-2">{rangeError}</div>
            )}
          </div>
        </div>
        <DialogFooter className="sticky z-10 px-8 py-6 border-t shadow-lg flex flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} className="px-6">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
