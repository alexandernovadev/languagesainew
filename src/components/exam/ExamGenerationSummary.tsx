import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  FileText, 
  Settings, 
  Sparkles,
  Brain,
  Zap,
  Star
} from "lucide-react";
import { ExamGeneratorFilters } from "@/hooks/useExamGenerator";
import { getLevelDescription, getDifficultyLabel } from "./helpers/examUtils";
import { questionTypes, questionLevels } from "@/data/questionTypes";

interface ExamGenerationSummaryProps {
  filters: ExamGeneratorFilters;
}

export function ExamGenerationSummary({ filters }: ExamGenerationSummaryProps) {
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return '☑️';
      case 'single_choice': return '🔘';
      case 'fill_blank': return '📝';
      case 'true_false': return '✅❌';
      case 'translate': return '🌐';
      case 'writing': return '✍️';
      default: return '❓';
    }
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'A1': return 'blue';
      case 'A2': return 'secondary';
      case 'B1': return 'yellow';
      case 'B2': return 'magenta';
      case 'C1': return 'destructive';
      case 'C2': return 'default';
      default: return 'outline';
    }
  };

  const getDifficultyVariant = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'blue';
      case 2: return 'secondary';
      case 3: return 'yellow';
      case 4: return 'magenta';
      case 5: return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-2 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-blue-400">
          <Sparkles className="h-5 w-5 text-blue-400" />
          Resumen del Examen
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Grid compacto de información */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          
          {/* Tema */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <h3 className="font-semibold text-blue-400 text-sm">Tema</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
              {filters.topic || "No especificado"}
            </p>
          </div>

          {/* Nivel */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-green-400" />
              <h3 className="font-semibold text-green-400 text-sm">Nivel</h3>
            </div>
            <Badge variant={getLevelVariant(filters.level)} className="border text-xs">
              {filters.level}
            </Badge>
          </div>

          {/* Dificultad */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-orange-400" />
              <h3 className="font-semibold text-orange-400 text-sm">Dificultad</h3>
            </div>
            <Badge variant={getDifficultyVariant(filters.difficulty)} className="border text-xs">
              {getDifficultyLabel(filters.difficulty)}
            </Badge>
          </div>

          {/* Número de preguntas */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-purple-400" />
              <h3 className="font-semibold text-purple-400 text-sm">Preguntas</h3>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-purple-400">
                {filters.numberOfQuestions}
              </span>
              <span className="text-xs text-gray-400">preguntas</span>
            </div>
          </div>

          {/* Tipos de preguntas */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-4 w-4 text-indigo-400" />
              <h3 className="font-semibold text-indigo-400 text-sm">Tipos</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.types.slice(0, 2).map((type) => (
                <Badge 
                  key={type} 
                  variant="outline" 
                  className="text-xs"
                >
                  {getQuestionTypeIcon(type)} {type.replace('_', ' ')}
                </Badge>
              ))}
              {filters.types.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{filters.types.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {/* Temas de gramática */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-pink-400" />
              <h3 className="font-semibold text-pink-400 text-sm">Gramática</h3>
            </div>
            {filters.grammarTopics.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {filters.grammarTopics.slice(0, 2).map((topic) => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="text-xs"
                  >
                    {topic}
                  </Badge>
                ))}
                {filters.grammarTopics.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{filters.grammarTopics.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Sin temas específicos</p>
            )}
          </div>

        </div>

      </CardContent>
    </Card>
  );
} 