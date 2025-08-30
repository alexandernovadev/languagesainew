import { useState } from "react";
import { toast } from "sonner";

import { useResultHandler } from "@/hooks/useResultHandler";
import { translationService, type TranslationAnalysis } from "@/services/translationService";

export function useTranslationAnalysis() {
  const { handleApiResult } = useResultHandler();
  const [analysis, setAnalysis] = useState<TranslationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeTranslation = async (data: {
    originalText: string;
    userTranslation: string;
    textId?: string;
    sourceLanguage?: string;
    targetLanguage?: string;
  }) => {
    setLoading(true);
    try {
      const result = await translationService.analyzeTranslation(data);
      setAnalysis(result);
      
      toast.success(`Translation analyzed - Score: ${result.score}/100`);
      
      return result;
    } catch (error) {
      handleApiResult(error, "Translation Analysis");
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
  };

  return {
    analysis,
    loading,
    analyzeTranslation,
    clearAnalysis
  };
}
