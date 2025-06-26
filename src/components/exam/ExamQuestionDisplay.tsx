import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExamQuestion } from '@/services/examService';

interface ExamQuestionDisplayProps {
  question: ExamQuestion;
  questionNumber: number;
}

export function ExamQuestionDisplay({ question, questionNumber }: ExamQuestionDisplayProps) {
  const renderQuestionContent = () => {
    // Helper para el círculo
    const renderCircle = (content: string, colorClass: string) => (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${colorClass} text-white`}>
        {content}
      </div>
    );

    // Si hay options, mostrar igual que multiple_choice
    if (question.options && question.options.length > 0) {
      return (
        <div className="space-y-3">
          <div className="grid gap-2">
            {question.options.map((option, index) => (
              <div
                key={option.value}
                className={`flex items-center p-3 rounded-lg border ${
                  option.isCorrect
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-muted/50 border-border'
                }`}
              >
                {renderCircle(option.value, option.isCorrect ? 'bg-green-500' : 'bg-muted')}
                <span className={option.isCorrect ? 'font-medium' : ''}>
                  {option.label}
                </span>
                {option.isCorrect && (
                  <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-600 dark:text-green-400">
                    Correcta
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Si no hay options, fallback por tipo
    switch (question.type) {
      case 'fill_blank':
      case 'translate':
      case 'writing':
        return (
          <div className="space-y-3">
            <div className="grid gap-2">
              {question.correctAnswers.map((answer, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-lg border bg-green-500/10 border-green-500/20"
                >
                  {renderCircle(String.fromCharCode(65 + index), 'bg-green-500')}
                  <span className="font-medium">
                    {answer}
                  </span>
                  <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-600 dark:text-green-400">
                    Correcta
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        );
      case 'true_false':
        return (
          <div className="space-y-3">
            <div className="grid gap-2">
              {['true', 'false'].map((val, idx) => (
                <div
                  key={val}
                  className={`flex items-center p-3 rounded-lg border ${
                    question.correctAnswers.includes(val)
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  {renderCircle(val === 'true' ? 'V' : 'F', question.correctAnswers.includes(val) ? 'bg-green-500' : 'bg-muted')}
                  <span className={question.correctAnswers.includes(val) ? 'font-medium' : ''}>
                    {val === 'true' ? 'Verdadero' : 'Falso'}
                  </span>
                  {question.correctAnswers.includes(val) && (
                    <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-600 dark:text-green-400">
                      Correcta
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Tipo de pregunta no soportado</div>;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'fill_blank':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'true_false':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'translate':
        return 'bg-orange-500/20 text-orange-600 dark:text-orange-400';
      case 'writing':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-muted-foreground">
                Pregunta {questionNumber}
              </span>
              <Badge className={getQuestionTypeColor(question.type)}>
                {question.type === 'multiple_choice' && 'Opción Múltiple'}
                {question.type === 'fill_blank' && 'Completar Espacios'}
                {question.type === 'true_false' && 'Verdadero/Falso'}
                {question.type === 'translate' && 'Traducción'}
                {question.type === 'writing' && 'Escritura'}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {question.text}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {renderQuestionContent()}
        
        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Explicación:</h4>
          <div 
            className="p-4 bg-muted/50 rounded-lg prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: question.explanation }}
          />
        </div>
        
        {question.tags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Etiquetas:</h4>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 