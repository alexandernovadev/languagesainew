import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Settings } from "lucide-react";
import { ExamGeneratorFilters } from "@/hooks/useExamGenerator";
import { questionTypes, questionLevels } from "@/data/questionTypes";
import { ExamFormField } from "./components/ExamFormField";
import { GrammarTopicsSelector } from "./components/GrammarTopicsSelector";
import {
  getDifficultyLabel,
  getLevelDescription,
  validateExamFilters,
} from "./helpers/examUtils";
import {
  LANGUAGE_OPTIONS,
  EXAM_GENERATION_TIPS,
  EXAM_VALIDATION_LIMITS,
} from "./constants/examConstants";

interface ExamConfigFormProps {
  filters: ExamGeneratorFilters;
  updateFilter: (key: keyof ExamGeneratorFilters, value: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

export function ExamConfigForm({
  filters,
  updateFilter,
  onGenerate,
  isGenerating,
  error,
}: ExamConfigFormProps) {
  const validation = validateExamFilters(filters);
  const isFormValid = validation.isValid && !isGenerating;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Main configuration */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración del Examen
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Layout principal: 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda: Todos los campos excepto temas de gramática */}
              <div className="space-y-6">
                {/* Tema del examen */}
                <ExamFormField
                  type="textarea"
                  label="Tema del Examen"
                  required
                  value={filters.topic}
                  onChange={(value) => updateFilter("topic", value)}
                  placeholder="Describe el tema principal del examen (ej: gramática básica, vocabulario de viajes, comprensión lectora...)"
                  description="Sé específico para obtener mejores resultados"
                  error={validation.errors.find((e) => e.includes("tema"))}
                />

                <Separator />

                {/* Configuración en grid de 4 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <ExamFormField
                    type="select"
                    label="Nivel CEFR"
                    value={filters.level}
                    onChange={(value) => updateFilter("level", value)}
                    options={questionLevels}
                    placeholder="Seleccionar nivel"
                    description={
                      filters.level ? getLevelDescription(filters.level) : undefined
                    }
                  />

                  <ExamFormField
                    type="slider"
                    label="Dificultad"
                    value={filters.difficulty}
                    onChange={(value) => updateFilter("difficulty", value)}
                    min={EXAM_VALIDATION_LIMITS.minDifficulty}
                    max={EXAM_VALIDATION_LIMITS.maxDifficulty}
                    step={1}
                    showLabels
                    getLabel={getDifficultyLabel}
                  />

                  <ExamFormField
                    type="number"
                    label="Número de Preguntas"
                    value={filters.numberOfQuestions}
                    onChange={(value) => updateFilter("numberOfQuestions", value)}
                    min={EXAM_VALIDATION_LIMITS.minQuestions}
                    max={EXAM_VALIDATION_LIMITS.maxQuestions}
                    description={`(${EXAM_VALIDATION_LIMITS.minQuestions}-${EXAM_VALIDATION_LIMITS.maxQuestions} preguntas)`}
                  />

                  <ExamFormField
                    type="select"
                    label="Idioma de las Explicaciones"
                    value={filters.userLang}
                    onChange={(value) => updateFilter("userLang", value)}
                    options={LANGUAGE_OPTIONS}
                    placeholder="Seleccionar idioma"
                  />
                </div>

                <Separator />

                {/* Tipos de preguntas */}
                <ExamFormField
                  type="checkbox-group"
                  label="Tipos de Preguntas"
                  value={filters.types}
                  onChange={(value) => updateFilter("types", value)}
                  options={questionTypes}
                  error={validation.errors.find((e) => e.includes("tipo"))}
                />

                {/* Tips */}
                <div className="p-4 bg-muted/50 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">
                    💡 Consejos para mejores resultados:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {EXAM_GENERATION_TIPS.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Columna derecha: Temas de gramática (altura completa) */}
              <div>
                <GrammarTopicsSelector
                  selectedTopics={filters.grammarTopics}
                  onTopicsChange={(topics) => updateFilter("grammarTopics", topics)}
                  error={validation.errors.find((e) => e.includes("gramática"))}
                />
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Generate button */}
            <div className="pt-4">
              <Button
                onClick={onGenerate}
                disabled={!isFormValid}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando Examen...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generar Examen con IA
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
