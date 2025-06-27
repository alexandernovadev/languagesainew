import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Save } from 'lucide-react';
import { getQuestionTypeLabel } from '../helpers/examUtils';

interface QuestionHeaderProps {
  questionNumber: number;
  questionType: string;
  questionText: string;
  isAnswered: boolean;
  isSaving: boolean;
}

export function QuestionHeader({
  questionNumber,
  questionType,
  questionText,
  isAnswered,
  isSaving
}: QuestionHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold text-base">
            {questionNumber}
          </div>
          <Badge variant="yellow" className="text-xs">
            {getQuestionTypeLabel(questionType)}
          </Badge>
          {isSaving && (
            <Badge variant="outline" className="text-xs">
              <Save className="h-3 w-3 mr-1 animate-spin" />
              Guardando...
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-medium leading-relaxed">
          {questionText}
        </h3>
      </div>
      
      {/* Answered indicator on the right */}
      {isAnswered && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors cursor-help border border-green-500/20">
                <CheckCircle className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Respondida</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
} 