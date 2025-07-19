import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import { useAnimatedMessages } from "@/hooks/useAnimatedMessages";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

interface ExamGenerationProgressProps {
  progress: number;
  isGenerating: boolean;
}

export function ExamGenerationProgress({
  progress,
  isGenerating,
}: ExamGenerationProgressProps) {
  const { currentMessage, currentMessageIndex, totalMessages } = useAnimatedMessages(isGenerating);
  const dots = useAnimatedDots();

  if (!isGenerating && progress === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {progress === 100 ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          )}
          {progress === 100 ? "Examen Generado" : "Generando Examen"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mensaje animado divertido */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg">
          <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-300">
              {currentMessage}
              <span className="text-blue-400">{dots}</span>
            </p>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {progress === 100 && (
          <div className="p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
            <p className="text-sm text-green-400 font-medium">
              ✅ ¡Examen generado exitosamente! Puedes revisar las preguntas a continuación.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
