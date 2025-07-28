import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Brain } from "lucide-react";
import { useGradingMessages } from "@/hooks/useAnimatedMessages";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

interface ExamGradingProgressProps {
  isGrading: boolean;
}

export function ExamGradingProgress({ isGrading }: ExamGradingProgressProps) {
  const { currentMessage } = useGradingMessages(isGrading);
  const dots = useAnimatedDots();

  if (!isGrading) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          Calificando Examen
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mensaje animado de calificación */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg">
          <Brain className="h-5 w-5 text-blue-400 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-300">
              {currentMessage}
              <span className="text-blue-400">{dots}</span>
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-900/10 border border-blue-700/20 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            La IA está analizando tus respuestas y generando un feedback
            personalizado...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
