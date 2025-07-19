import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getAuthHeaders } from "@/utils/services";

interface TopicGeneratorOptions {
  type: "lecture" | "exam";
  onTopicGenerated?: (topic: string) => void;
}

export function useTopicGenerator({ type, onTopicGenerated }: TopicGeneratorOptions) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTopic = useCallback(async (existingText: string = "") => {
    setIsGenerating(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/ai/generate-topic-stream`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            existingText,
            type,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate topic");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let currentTopic = "";

      // Clear existing text and start streaming
      onTopicGenerated?.("");

      while (!done) {
        const { value, done: streamDone } = await reader!.read();
        done = streamDone;
        const chunk = decoder.decode(value, { stream: true });
        currentTopic += chunk;
        onTopicGenerated?.(currentTopic);
      }

      toast.success("¡Tema generado exitosamente!");
    } catch (error: any) {
      toast.error(error.message || "Error al generar el tema");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [type, onTopicGenerated]);

  return {
    isGenerating,
    generateTopic,
  };
} 