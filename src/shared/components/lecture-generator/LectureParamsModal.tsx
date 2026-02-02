import { useState, useEffect } from "react";
import { ModalNova } from "@/shared/components/ui/modal-nova";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Settings, SlidersHorizontal, BookOpen } from "lucide-react";
import {
  languagesJson,
  certificationLevelsJson,
  readingTypesJson,
} from "@/data/bussiness/shared";
import { GrammarTopicsSelector } from "./GrammarTopicsSelector";
import { WordSelector } from "./WordSelector";
import { Language, CertificationLevel, ReadingType } from "@/types/business";
import { GrammarTopicOption } from "@/types/business";

// Importar grammar topics según idioma
import { grammarTopicsJson as enGrammarTopics } from "@/data/bussiness/en";
import { grammarTopicsJson as esGrammarTopics } from "@/data/bussiness/es";
import { grammarTopicsJson as ptGrammarTopics } from "@/data/bussiness/pt";

interface LectureParams {
  language: Language;
  level: CertificationLevel;
  typeWrite: ReadingType;
  rangeMin: number;
  rangeMax: number;
  addEasyWords: boolean;
  grammarTopics: string[];
  selectedWords: string[];
}

interface LectureParamsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params: LectureParams;
  onApply: (params: LectureParams) => void;
}

const getGrammarTopicsByLanguage = (language: Language): GrammarTopicOption[] => {
  switch (language) {
    case "es":
      return esGrammarTopics;
    case "pt":
      return ptGrammarTopics;
    case "en":
    default:
      return enGrammarTopics;
  }
};

export function LectureParamsModal({
  open,
  onOpenChange,
  params,
  onApply,
}: LectureParamsModalProps) {
  const [localParams, setLocalParams] = useState<LectureParams>(params);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced" | "words">("basic");

  // Sincronizar parámetros locales cuando se abre el modal
  useEffect(() => {
    if (open) {
      setLocalParams(params);
      setActiveTab("basic");
    }
  }, [open, params]);

  const updateParam = <K extends keyof LectureParams>(
    key: K,
    value: LectureParams[K]
  ) => {
    setLocalParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    // Validaciones
    if (localParams.rangeMin >= localParams.rangeMax) {
      alert("El mínimo de palabras debe ser menor que el máximo");
      return;
    }

    onApply(localParams);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalParams(params); // Resetear a valores originales
    onOpenChange(false);
  };

  const grammarTopics = getGrammarTopicsByLanguage(localParams.language);

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title="Configuración de Generación"
      description="Ajusta los parámetros para personalizar la lectura generada"
      size="2xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleApply}>Aplicar</Button>
        </div>
      }
    >
      <div className="px-6 py-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">
              <Settings className="h-4 w-4 mr-2" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Avanzado
            </TabsTrigger>
            <TabsTrigger value="words">
              <BookOpen className="h-4 w-4 mr-2" />
              Mis Palabras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
          {/* Idioma */}
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select
              value={localParams.language}
              onValueChange={(value) => updateParam("language", value as Language)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languagesJson.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nivel */}
          <div className="space-y-2">
            <Label>Nivel de Certificación</Label>
            <Select
              value={localParams.level}
              onValueChange={(value) =>
                updateParam("level", value as CertificationLevel)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {certificationLevelsJson.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Lectura */}
          <div className="space-y-2">
            <Label>Tipo de Lectura</Label>
            <Select
              value={localParams.typeWrite}
              onValueChange={(value) =>
                updateParam("typeWrite", value as ReadingType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {readingTypesJson.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-4">
          {/* Rango de palabras */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mínimo de Palabras</Label>
              <Input
                type="number"
                min="100"
                max="1000"
                value={localParams.rangeMin}
                onChange={(e) =>
                  updateParam("rangeMin", parseInt(e.target.value) || 200)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Máximo de Palabras</Label>
              <Input
                type="number"
                min="100"
                max="1000"
                value={localParams.rangeMax}
                onChange={(e) =>
                  updateParam("rangeMax", parseInt(e.target.value) || 400)
                }
              />
            </div>
          </div>

          {/* Incluir palabras fáciles */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Incluir Palabras Fáciles</Label>
              <p className="text-xs text-muted-foreground">
                Incluye palabras marcadas como fáciles en el texto
              </p>
            </div>
            <Switch
              checked={localParams.addEasyWords}
              onCheckedChange={(checked) =>
                updateParam("addEasyWords", checked)
              }
            />
          </div>

          {/* Temas de gramática */}
          <GrammarTopicsSelector
            topics={grammarTopics}
            selected={localParams.grammarTopics}
            onChange={(selected) => updateParam("grammarTopics", selected)}
            maxSelections={5}
          />
        </TabsContent>

        <TabsContent value="words" className="space-y-4 mt-4">
          {/* Palabras seleccionadas */}
          <WordSelector
            selected={localParams.selectedWords}
            onChange={(selected) => updateParam("selectedWords", selected)}
            language={localParams.language}
            maxSelections={10}
          />
        </TabsContent>
      </Tabs>
      </div>
    </ModalNova>
  );
}
