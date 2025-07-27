import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ExamSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  answeredCount: number;
  totalQuestions: number;
}

export function ExamSubmissionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  answeredCount,
  totalQuestions
}: ExamSubmissionModalProps) {
  const unansweredCount = totalQuestions - answeredCount;
  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const getCompletionStatus = () => {
    if (completionPercentage === 100) {
      return {
        icon: <CheckCircle className="h-6 w-6 text-green-600" />,
        title: "¡Examen completo!",
        description: "Has respondido todas las preguntas. ¿Estás listo para enviar?",
        variant: "success" as const
      };
    } else if (completionPercentage >= 80) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
        title: "Casi completo",
        description: `Has respondido ${answeredCount} de ${totalQuestions} preguntas. ¿Quieres continuar o enviar ahora?`,
        variant: "warning" as const
      };
    } else {
      return {
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        title: "Examen incompleto",
        description: `Solo has respondido ${answeredCount} de ${totalQuestions} preguntas. Te recomendamos completar todas las preguntas.`,
        variant: "danger" as const
      };
    }
  };

  const status = getCompletionStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-foreground border border-gray-600 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status.icon}
            {status.title}
          </DialogTitle>
          <DialogDescription>
            {status.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Summary */}
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{answeredCount} respondidas</span>
              <span>{unansweredCount} sin responder</span>
            </div>
          </div>

          {/* Warning for incomplete exam */}
          {completionPercentage < 100 && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Examen incompleto
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-100 mt-1">
                    Las preguntas sin responder no tendrán puntaje. 
                    {unansweredCount === 1 
                      ? ' Te falta 1 pregunta.' 
                      : ` Te faltan ${unansweredCount} preguntas.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Final confirmation */}
          <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Importante:</strong> Una vez enviado, no podrás modificar tus respuestas.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Continuar
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className={
              completionPercentage === 100 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Examen'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 