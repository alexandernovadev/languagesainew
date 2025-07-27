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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrammarTopicsSelector } from "@/components/exam/components/GrammarTopicsSelector";

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
    grammarTopics?: string[];
  };
  onSave: (config: {
    level: string;
    typeWrite: string;
    difficulty: string;
    addEasyWords: boolean;
    language: string;
    rangeMin: number;
    rangeMax: number;
    grammarTopics: string[];
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
    language: initialConfig.language || "en",
    rangeMin: initialConfig.rangeMin ?? 5200,
    rangeMax: initialConfig.rangeMax ?? 6500,
    grammarTopics: initialConfig.grammarTopics || [],
  });
  const [rangeError, setRangeError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTempConfig({
        ...initialConfig,
        language: initialConfig.language || "en",
        rangeMin: initialConfig.rangeMin ?? 5200,
        rangeMax: initialConfig.rangeMax ?? 6500,
        grammarTopics: initialConfig.grammarTopics || [],
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
      <DialogContent className="max-w-4xl p-0 border border-gray-600 shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Configuración avanzada
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Ajusta los parámetros de la lectura generada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
          {/* Sección 1: Idioma, Nivel y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Idioma */}
            <div>
              <Label htmlFor="language" className="text-sm font-medium">Idioma</Label>
              <Select
                value={tempConfig.language}
                onValueChange={(v) =>
                  setTempConfig((c) => ({ ...c, language: v }))
                }
              >
                <SelectTrigger id="language" className="h-9 mt-1">
                  <SelectValue placeholder="Idioma" />
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
              <Label htmlFor="level" className="text-sm font-medium">Nivel</Label>
              <Select
                value={tempConfig.level}
                onValueChange={(v) =>
                  setTempConfig((c) => ({ ...c, level: v }))
                }
              >
                <SelectTrigger id="level" className="h-9 mt-1">
                  <SelectValue placeholder="Nivel" />
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
            
            {/* Tipo */}
            <div>
              <Label htmlFor="typeWrite" className="text-sm font-medium">Tipo</Label>
              <Select
                value={tempConfig.typeWrite}
                onValueChange={(v) =>
                  setTempConfig((c) => ({ ...c, typeWrite: v }))
                }
              >
                <SelectTrigger id="typeWrite" className="h-9 mt-1">
                  <SelectValue placeholder="Tipo" />
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
          </div>

          {/* Sección 2: Dificultad, Vocabulario y Longitud */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Dificultad */}
            <div>
              <Label htmlFor="difficulty" className="text-sm font-medium">Dificultad</Label>
              <Select
                value={tempConfig.difficulty}
                onValueChange={(v) =>
                  setTempConfig((c) => ({ ...c, difficulty: v }))
                }
              >
                <SelectTrigger id="difficulty" className="h-9 mt-1">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vocabulario adicional */}
            <div className="flex items-end">
              <div className="flex items-center gap-2 h-9">
                <Checkbox
                  id="addEasyWords"
                  checked={tempConfig.addEasyWords}
                  onCheckedChange={(v) =>
                    setTempConfig((c) => ({ ...c, addEasyWords: !!v }))
                  }
                />
                <Label htmlFor="addEasyWords" className="text-sm">
                  Vocabulario adicional
                </Label>
              </div>
            </div>

            {/* Longitud mínima */}
            <div>
              <Label htmlFor="rangeMin" className="text-sm font-medium">Mín (chars)</Label>
              <input
                id="rangeMin"
                type="number"
                min={100}
                max={100000}
                className="h-9 w-full mt-1 border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary text-sm"
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
              <Label htmlFor="rangeMax" className="text-sm font-medium">Máx (chars)</Label>
              <input
                id="rangeMax"
                type="number"
                min={100}
                max={100000}
                className="h-9 w-full mt-1 border rounded-md px-3 py-2 bg-background focus:ring-2 focus:ring-primary text-sm"
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

          {/* Error de rango */}
          {rangeError && (
            <div className="text-red-500 text-xs">{rangeError}</div>
          )}

          {/* Sección 3: Tabs para Gramática y Palabras */}
          <div className="mt-6">
            <Tabs defaultValue="grammar" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grammar">Temas de Gramática</TabsTrigger>
                <TabsTrigger value="words">Palabras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grammar" className="mt-4">
                <GrammarTopicsSelector
                  selectedTopics={tempConfig.grammarTopics}
                  onTopicsChange={(topics) =>
                    setTempConfig((c) => ({ ...c, grammarTopics: topics }))
                  }
                />
              </TabsContent>
              
              <TabsContent value="words" className="mt-4">
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">Selección de Palabras</h3>
                    <p className="text-sm text-muted-foreground">
                      Aquí podrás seleccionar palabras específicas para incluir en la lectura.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Agregar Palabras
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} size="sm">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
