import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, Settings } from 'lucide-react';
import { ExamGeneratorFilters } from '@/hooks/useExamGenerator';
import { questionTypes, questionLevels, questionDifficulties } from '@/data/questionTypes';
import { SuggestedTopics } from './SuggestedTopics';

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
  error
}: ExamConfigFormProps) {
  const handleQuestionTypeToggle = (type: string) => {
    const currentTypes = [...filters.types];
    const index = currentTypes.indexOf(type);
    
    if (index > -1) {
      currentTypes.splice(index, 1);
    } else {
      currentTypes.push(type);
    }
    
    updateFilter('types', currentTypes);
  };

  const handleTopicSelect = (topic: string) => {
    updateFilter('topic', topic);
  };

  const getDifficultyLabel = (value: number) => {
    const difficulty = questionDifficulties.find(d => d.value === value);
    return difficulty?.label || `Nivel ${value}`;
  };

  const getLevelDescription = (level: string) => {
    const levelData = questionLevels.find(l => l.value === level);
    return levelData?.description || '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main configuration */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración del Examen
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Tema del examen */}
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-base font-medium">
                Tema del Examen *
              </Label>
              <Textarea
                id="topic"
                placeholder="Describe el tema principal del examen (ej: gramática básica, vocabulario de viajes, comprensión lectora...)"
                value={filters.topic}
                onChange={(e) => updateFilter('topic', e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Sé específico para obtener mejores resultados
              </p>
            </div>

            <Separator />

            {/* Nivel y dificultad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-base font-medium">
                  Nivel CEFR
                </Label>
                <Select
                  value={filters.level}
                  onValueChange={(value) => updateFilter('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{level.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {level.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.level && (
                  <p className="text-sm text-muted-foreground">
                    {getLevelDescription(filters.level)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-base font-medium">
                  Dificultad
                </Label>
                <div className="space-y-3">
                  <Slider
                    value={[filters.difficulty]}
                    onValueChange={(value) => updateFilter('difficulty', value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Muy Fácil</span>
                    <span className="font-medium">
                      {getDifficultyLabel(filters.difficulty)}
                    </span>
                    <span>Muy Difícil</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Número de preguntas */}
            <div className="space-y-2">
              <Label htmlFor="numberOfQuestions" className="text-base font-medium">
                Número de Preguntas
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="numberOfQuestions"
                  type="number"
                  value={filters.numberOfQuestions}
                  onChange={(e) => updateFilter('numberOfQuestions', parseInt(e.target.value))}
                  min={1}
                  max={50}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  (1-50 preguntas)
                </span>
              </div>
            </div>

            <Separator />

            {/* Tipos de preguntas */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Tipos de Preguntas
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {questionTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={filters.types.includes(type.value)}
                      onCheckedChange={() => handleQuestionTypeToggle(type.value)}
                    />
                    <Label
                      htmlFor={type.value}
                      className="flex flex-col cursor-pointer"
                    >
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
              {filters.types.length === 0 && (
                <p className="text-sm text-destructive">
                  Selecciona al menos un tipo de pregunta
                </p>
              )}
            </div>

            <Separator />

            {/* Idioma */}
            <div className="space-y-2">
              <Label htmlFor="userLang" className="text-base font-medium">
                Idioma de las Explicaciones
              </Label>
              <Select
                value={filters.userLang}
                onValueChange={(value) => updateFilter('userLang', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
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
                disabled={isGenerating || !filters.topic.trim() || filters.types.length === 0}
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

            {/* Tips */}
            <div className="p-4 bg-muted/50 border border-border rounded-lg">
              <h4 className="font-medium mb-2">💡 Consejos para mejores resultados:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sé específico con el tema (ej: "verbos irregulares en presente" en lugar de "gramática")</li>
                <li>• Combina diferentes tipos de preguntas para variedad</li>
                <li>• Ajusta la dificultad según el nivel CEFR seleccionado</li>
                <li>• Usa entre 10-20 preguntas para un examen equilibrado</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggested topics sidebar */}
      <div className="lg:col-span-1">
        <SuggestedTopics 
          onTopicSelect={handleTopicSelect}
          selectedTopic={filters.topic}
        />
      </div>
    </div>
  );
} 