import React from "react";
import { Sparkles } from "lucide-react";
import { useAnimatedMessages } from "@/hooks/useAnimatedMessages";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

interface ExamGenerationProgressProps {
  isGenerating: boolean;
}

export function ExamGenerationProgress({
  isGenerating,
}: ExamGenerationProgressProps) {
  const { currentMessage } = useAnimatedMessages(isGenerating);
  const dots = useAnimatedDots();

  if (!isGenerating) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg">
      <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-300">
          {currentMessage}
          <span className="text-blue-400">{dots}</span>
        </p>
      </div>
    </div>
  );
}
