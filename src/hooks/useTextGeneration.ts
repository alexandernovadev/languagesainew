import { useState } from "react";
import { toast } from "sonner";

import { useResultHandler } from "@/hooks/useResultHandler";
import { translationService, type TranslationConfig } from "@/services/translationService";

export function useTextGeneration() {
  const { handleApiResult } = useResultHandler();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<TranslationConfig | null>(null);

  const generateText = async (newConfig: TranslationConfig, chatId?: string) => {
    setLoading(true);
    setText('');
    setConfig(newConfig);
    
    try {
      await translationService.generateTextStream(newConfig, (chunk) => {
        setText(prev => prev + chunk);
      }, chatId);
      
      toast.success("Text generated successfully");
    } catch (error) {
      handleApiResult(error, "Text Generation");
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => {
    setText('');
    setConfig(null);
  };

  return {
    text,
    loading,
    config,
    generateText,
    clearText
  };
}
