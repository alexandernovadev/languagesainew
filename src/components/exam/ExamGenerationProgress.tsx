import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import { getProgressMessage } from "./helpers/examUtils";

interface ExamGenerationProgressProps {
  progress: number;
  isGenerating: boolean;
}

export function ExamGenerationProgress({
  progress,
  isGenerating,
}: ExamGenerationProgressProps) {
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
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {getProgressMessage(progress)}
          </p>
        </div>

        {progress === 100 && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✅ El examen ha sido generado exitosamente. Puedes revisar las
              preguntas a continuación.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
