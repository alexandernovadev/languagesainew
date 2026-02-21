import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { languagesJson, certificationLevelsJson } from "@/data/bussiness/shared";
import { GrammarTopicsSelector } from "@/shared/components/lecture-generator/GrammarTopicsSelector";
import { QuestionTypesSelector } from "./QuestionTypesSelector";
import { grammarTopicsJson as enGrammarTopics } from "@/data/bussiness/en";
import { grammarTopicsJson as esGrammarTopics } from "@/data/bussiness/es";
import { grammarTopicsJson as ptGrammarTopics } from "@/data/bussiness/pt";
import type { ExamQuestionType } from "@/types/models";
import { Rocket } from "lucide-react";

const getGrammarTopicsByLanguage = (language: string) => {
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

interface ExamGeneratorParams {
  language: string;
  difficulty: string;
  grammarTopics: string[];
  questionTypes: ExamQuestionType[];
  questionCount: number;
  topic: string;
}

interface ExamParamsTabProps {
  params: ExamGeneratorParams;
  onParamChange: <K extends keyof ExamGeneratorParams>(
    key: K,
    value: ExamGeneratorParams[K]
  ) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ExamParamsTab({
  params,
  onParamChange,
  onGenerate,
  isGenerating,
}: ExamParamsTabProps) {
  const grammarTopics = getGrammarTopicsByLanguage(params.language);
  const [countInput, setCountInput] = useState(String(params.questionCount));

  useEffect(() => {
    setCountInput(String(params.questionCount));
  }, [params.questionCount]);

  const commitCount = () => {
    const v = parseInt(countInput, 10);
    const clamped = Number.isNaN(v) ? 10 : Math.min(20, Math.max(5, v));
    onParamChange("questionCount", clamped);
    setCountInput(String(clamped));
  };

  return (
    <div className="space-y-6">
      {/* Idioma y dificultad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Idioma</Label>
          <Select
            value={params.language}
            onValueChange={(v) => onParamChange("language", v)}
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
        <div className="space-y-2">
          <Label>Dificultad</Label>
          <Select
            value={params.difficulty}
            onValueChange={(v) => onParamChange("difficulty", v)}
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
      </div>

      {/* Temas de gramática */}
      <GrammarTopicsSelector
        topics={grammarTopics}
        selected={params.grammarTopics}
        onChange={(selected) => onParamChange("grammarTopics", selected)}
        maxSelections={5}
      />

      {/* Tipos de pregunta */}
      <QuestionTypesSelector
        selected={params.questionTypes}
        onChange={(selected) => onParamChange("questionTypes", selected)}
      />

      {/* Cantidad y tema opcional */}
      <div className="space-y-4">
        <div className="space-y-2 max-w-[140px]">
          <Label>Cantidad de preguntas</Label>
          <Input
            type="number"
            min={5}
            max={20}
            value={countInput}
            onChange={(e) => setCountInput(e.target.value)}
            onBlur={commitCount}
          />
          <p className="text-xs text-muted-foreground">Entre 5 y 20</p>
        </div>
        <div className="space-y-2">
          <Label>Tema opcional</Label>
          <Input
            placeholder="Ej: viajes, trabajo, medio ambiente..."
            value={params.topic}
            onChange={(e) => onParamChange("topic", e.target.value)}
          />
        </div>
      </div>

      {/* Botón generar */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onGenerate}
          disabled={
            isGenerating ||
            params.grammarTopics.length === 0 ||
            params.questionTypes.length === 0 ||
            params.questionCount < 5 ||
            params.questionCount > 20
          }
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
        >
          <Rocket className="h-5 w-5 mr-2" />
          Generar examen
        </Button>
      </div>
    </div>
  );
}
