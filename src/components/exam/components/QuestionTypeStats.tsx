import React from 'react';
import { Badge } from '@/components/ui/badge';
import { calculateQuestionTypeStats, getQuestionTypeLabel } from '../helpers/examUtils';
import { QUESTION_TYPE_CHART_COLORS } from '../constants/examConstants';
import { QuestionTypeStatsProps } from '../types/examTypes';

export function QuestionTypeStats({ 
  questions, 
  showChart = true, 
  showPercentages = true 
}: QuestionTypeStatsProps) {
  const questionTypeStats = calculateQuestionTypeStats(questions);
  const totalQuestions = questions.length;
  const questionTypes = Object.keys(questionTypeStats);

  if (questionTypes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No hay preguntas para mostrar estadísticas
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-foreground">Estadísticas de Preguntas</h4>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-500/10 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalQuestions}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Total</div>
        </div>
        
        {questionTypes.map(type => (
          <div key={type} className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">
              {questionTypeStats[type]}
            </div>
            <div className="text-xs text-muted-foreground">
              {getQuestionTypeLabel(type)}
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Chart */}
      {showChart && (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Distribución por Tipo</h4>
          <div className="space-y-2">
            {questionTypes.map(type => {
              const count = questionTypeStats[type];
              const percentage = Math.round((count / totalQuestions) * 100);
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getQuestionTypeLabel(type)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {count} preguntas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${QUESTION_TYPE_CHART_COLORS[type as keyof typeof QUESTION_TYPE_CHART_COLORS] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {showPercentages && (
                      <span className="text-xs text-muted-foreground w-8">
                        {percentage}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 