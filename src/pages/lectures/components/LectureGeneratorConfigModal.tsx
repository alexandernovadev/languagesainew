import React, { useState, useEffect } from "react";
import { ModalNova } from "@/components/ui/modal-nova";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { GrammarSelector } from "@/components/forms/GrammarSelector";
import { WordsSelector } from "@/components/forms/WordsSelector";
import { grammarTopicGroups } from "@/data/grammarTopics"; // Import the new data
import { Settings, BookOpen, FileText } from "lucide-react";
import { getAllowedLanguages } from "@/constants/identity";

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
    typeWrite: string; // TODO Como asi q string, por eso laneed de humano en el code
    difficulty: string;
    language: string; // TODO mire a este hp
    rangeMin: number;
    rangeMax: number;
    grammarTopics: string[]; // todo String again
    selectedWords: string[];
  }) => void;
  lectureLevels: { value: string; label: string }[];
  lectureTypes: { value: string; label: string }[];
}

const LANG_OPTIONS = getAllowedLanguages().map(l => ({ value: l.code, label: `${l.flag} ${l.name}` }));

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
          {/* Contenedor con scroll horizontal en móvil */}
          <div className="max-sm:overflow-x-auto max-sm:pb-2">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 max-sm:flex max-sm:w-max max-sm:min-w-full sticky top-1 z-10">
              <TabsTrigger value="basic" className="flex items-center gap-2 max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                <Settings className="h-4 w-4" />
                <span className="max-sm:hidden sm:inline">Básico</span>
                <span className="sm:hidden">Básico</span>
              </TabsTrigger>
              <TabsTrigger value="grammar" className="flex items-center gap-2 max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                <BookOpen className="h-4 w-4" />
                <span className="max-sm:hidden sm:inline">Gramática</span>
                <span className="sm:hidden">Gramática</span>
              </TabsTrigger>
              <TabsTrigger value="words" className="flex items-center gap-2 max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                <FileText className="h-4 w-4" />
                <span className="max-sm:hidden sm:inline">Palabras</span>
                <span className="sm:hidden">Palabras</span>
              </TabsTrigger>
            </TabsList>
          </div>

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
            <GrammarSelector
              grammarTopicGroups={grammarTopicGroups} // Pass the data here
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
