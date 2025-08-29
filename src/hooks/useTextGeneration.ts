import { useState } from "react";
import { toast } from "sonner";

import { useResultHandler } from "@/hooks/useResultHandler";
import { translationService, type TranslationConfig } from "@/services/translationService";

export function useTextGeneration() {
  const { handleApiResult } = useResultHandler();
  const [text, setText] = useState('');
  const [textId, setTextId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<TranslationConfig | null>(null);

  const generateText = async (newConfig: TranslationConfig, chatId?: string) => {
    setLoading(true);
    setText('');
    setTextId('');
    setConfig(newConfig);
    
    try {
      // Generate a unique ID for this text
      const newTextId = `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setTextId(newTextId);
      
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
    setTextId('');
    setConfig(null);
  };

  return {
    text,
    textId,
    loading,
    config,
    generateText,
    clearText
  };
}
