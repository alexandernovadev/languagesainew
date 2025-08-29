import { useState, useEffect } from "react";
import { toast } from "sonner";

import { useResultHandler } from "@/hooks/useResultHandler";
import { translationService, type PreloadedConfigs } from "@/services/translationService";

export function useTranslationConfig() {
  const { handleApiResult } = useResultHandler();
  const [configs, setConfigs] = useState<PreloadedConfigs | null>(null);
  const [loading, setLoading] = useState(false);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const result = await translationService.getConfigs();
      setConfigs(result);
      toast.success("Configuration loaded successfully");
    } catch (error) {
      handleApiResult(error, "Translation Config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  return {
    configs,
    loading,
    loadConfigs
  };
}
