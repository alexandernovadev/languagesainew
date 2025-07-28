import React, { useState, useEffect } from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { GrammarTopicsSelector } from "@/components/exam/components/GrammarTopicsSelector";
import { WordsSelector } from "@/components/forms/WordsSelector";
import { Settings, BookOpen, FileText } from "lucide-react";

interface LectureGeneratorConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialConfig: {
    level: string;
    typeWrite: string;
    difficulty: string;
    language?: string;
    rangeMin?: number;
    rangeMax?: number;
    grammarTopics?: string[];
    selectedWords?: string[];
    preloadedWords?: Record<string, { word: string }[]>;
  };
  onSave: (config: {
    level: string;
    typeWrite: string;
    difficulty: string;
    language: string;
    rangeMin: number;
    rangeMax: number;
    grammarTopics: string[];
    selectedWords: string[];
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
    selectedWords: initialConfig.selectedWords || [],
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
        selectedWords: initialConfig.selectedWords || [],
      });
      setRangeError(null);
    }
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
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title="Configuración avanzada"
      description="Ajusta los parámetros de la lectura generada."
      size="4xl"
      height="h-[90dvh]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} size="sm">
            Guardar
          </Button>
        </>
      }
    >
      <div className="px-6 pb-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sticky top-1 z-10">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="grammar" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Gramática
            </TabsTrigger>
            <TabsTrigger value="words" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Palabras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            <Card>
              <CardContent className="space-y-4 pt-4">
                {/* Sección 1: Idioma, Nivel y Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Idioma */}
                  <div>
                    <Label htmlFor="language" className="text-sm font-medium">
                      Idioma
                    </Label>
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
                    <Label htmlFor="level" className="text-sm font-medium">
                      Nivel
                    </Label>
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
                    <Label htmlFor="typeWrite" className="text-sm font-medium">
                      Tipo
                    </Label>
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

                {/* Sección 2: Dificultad y Longitud */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Dificultad */}
                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-medium">
                      Dificultad
                    </Label>
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

                  {/* Longitud mínima */}
                  <div>
                    <Label htmlFor="rangeMin" className="text-sm font-medium">
                      Mín (chars)
                    </Label>
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
                    <Label htmlFor="rangeMax" className="text-sm font-medium">
                      Máx (chars)
                    </Label>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grammar" className="mt-4">
            <GrammarTopicsSelector
              selectedTopics={tempConfig.grammarTopics}
              onTopicsChange={(topics) =>
                setTempConfig((c) => ({ ...c, grammarTopics: topics }))
              }
            />
          </TabsContent>

          <TabsContent value="words" className="mt-4">
            <WordsSelector
              selectedWords={tempConfig.selectedWords}
              onWordsChange={(words) =>
                setTempConfig((c) => ({ ...c, selectedWords: words }))
              }
              preloadedWords={initialConfig.preloadedWords}
            />
          </TabsContent>
        </Tabs>
      </div>
      </ModalNova>
    );
  }
