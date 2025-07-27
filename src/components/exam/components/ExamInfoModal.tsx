import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Lightbulb, BookOpen } from "lucide-react";
import { EXAM_GENERATION_TIPS } from "../constants/examConstants";

interface ExamInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamInfoModal({ isOpen, onClose }: ExamInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-600 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información del Generador de Exámenes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Consejos para mejores resultados */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold">Consejos para mejores resultados</h3>
            </div>
            <div className="pl-7">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {EXAM_GENERATION_TIPS.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            {/* ¿Cómo funciona? */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">¿Cómo funciona?</h3>
              </div>
              <div className="pl-7 space-y-3 text-sm text-muted-foreground">
                <p>
                  Los temas seleccionados se incluirán obligatoriamente en el examen. 
                  La IA distribuirá las preguntas para cubrir cada tema de gramática seleccionado.
                </p>
                <p>
                  El sistema utiliza inteligencia artificial avanzada para generar preguntas 
                  que se adaptan al nivel CEFR seleccionado y cubren los temas de gramática 
                  que hayas especificado.
                </p>
                <p>
                  Puedes personalizar la dificultad, el número de preguntas y los tipos 
                  de ejercicios según tus necesidades específicas.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 