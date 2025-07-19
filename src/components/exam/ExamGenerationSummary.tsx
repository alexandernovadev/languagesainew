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
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-blue-400">
            <Sparkles className="h-6 w-6 text-blue-400" />
            Resumen del Examen
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Tema */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-blue-400">Tema</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {filters.topic || "No especificado"}
              </p>
            </div>

            {/* Nivel */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-green-400">Nivel CEFR</h3>
              </div>
              <Badge variant={getLevelVariant(filters.level)} className="border">
                {filters.level}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">
                {getLevelDescription(filters.level)}
              </p>
            </div>

            {/* Dificultad */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-orange-400" />
                <h3 className="font-semibold text-orange-400">Dificultad</h3>
              </div>
              <Badge variant={getDifficultyVariant(filters.difficulty)} className="border">
                {getDifficultyLabel(filters.difficulty)}
              </Badge>
            </div>

            {/* Número de preguntas */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-purple-400">Preguntas</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-400">
                  {filters.numberOfQuestions}
                </span>
                <span className="text-sm text-gray-400">preguntas</span>
              </div>
            </div>

            {/* Tipos de preguntas */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-5 w-5 text-indigo-400" />
                <h3 className="font-semibold text-indigo-400">Tipos</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {filters.types.map((type) => (
                  <Badge 
                    key={type} 
                    variant="outline" 
                    className="text-xs"
                  >
                    {getQuestionTypeIcon(type)} {type.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Temas de gramática */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="h-5 w-5 text-pink-400" />
                <h3 className="font-semibold text-pink-400">Gramática</h3>
              </div>
              {filters.grammarTopics.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {filters.grammarTopics.slice(0, 3).map((topic) => (
                    <Badge 
                      key={topic} 
                      variant="outline" 
                      className="text-xs"
                    >
                      {topic}
                    </Badge>
                  ))}
                  {filters.grammarTopics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{filters.grammarTopics.length - 3} más
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Sin temas específicos</p>
              )}
            </div>

          </div>

          {/* Mensaje motivacional */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-700/30">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-400 animate-pulse" />
              <p className="text-sm font-medium text-blue-300">
                ¡Tu examen personalizado está siendo creado con amor y tecnología! 🌟
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    );
} 