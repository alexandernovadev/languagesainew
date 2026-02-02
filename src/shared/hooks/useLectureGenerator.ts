import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Language, CertificationLevel, ReadingType } from "@/types/business";
import { ILecture } from "@/types/models/Lecture";
import { lectureService } from "@/services/lectureService";

// Helper para obtener token
const getAuthHeaders = () => {
  const token = localStorage.getItem("user-storage")
    ? JSON.parse(localStorage.getItem("user-storage") || "{}")?.state?.token
    : null;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

interface LectureParams {
  language: Language;
  level: CertificationLevel;
  typeWrite: ReadingType;
  rangeMin: number;
  rangeMax: number;
  addEasyWords: boolean;
  grammarTopics: string[];
  selectedWords: string[];
}

interface UseLectureGeneratorReturn {
  // Estado
  keywords: string;
  setKeywords: (value: string) => void;
  generatedTopic: string;
  isGeneratingTopic: boolean;
  generatedText: string;
  isGenerating: boolean;
  params: LectureParams;
  paramsModalOpen: boolean;
  setParamsModalOpen: (open: boolean) => void;
  
  // Tema
  generateTopic: () => Promise<void>;
  
  // Generación
  generateText: () => Promise<void>;
  
  // Parámetros
  updateParam: <K extends keyof LectureParams>(key: K, value: LectureParams[K]) => void;
  resetParams: () => void;
  
  // Acciones
  saveLecture: (additionalData?: Partial<ILecture>) => Promise<void>;
  regenerate: () => Promise<void>;
  clearPreview: () => void;
  clearTopic: () => void;
}

const DEFAULT_PARAMS: LectureParams = {
  language: "en",
  level: "B1",
  typeWrite: "narrative",
  rangeMin: 200,
  rangeMax: 400,
  addEasyWords: false,
  grammarTopics: [],
  selectedWords: [],
};

export function useLectureGenerator(): UseLectureGeneratorReturn {
  const [keywords, setKeywords] = useState("");
  const [generatedTopic, setGeneratedTopic] = useState("");
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [params, setParams] = useState<LectureParams>(DEFAULT_PARAMS);
  const [paramsModalOpen, setParamsModalOpen] = useState(false);
  
  // Refs para callbacks de streaming
  const topicCallbackRef = useRef<(topic: string) => void>();
  const textCallbackRef = useRef<(text: string) => void>();

  // Generar tema
  const generateTopic = useCallback(async () => {
    setIsGeneratingTopic(true);
    setGeneratedTopic("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/lectures/generate-topic-stream`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            existingText: keywords.trim(),
            type: "lecture",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate topic");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let done = false;
      let currentTopic = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        const chunk = decoder.decode(value, { stream: true });
        currentTopic += chunk;
        setGeneratedTopic(currentTopic);
        topicCallbackRef.current?.(currentTopic);
      }

      toast.success("¡Tema generado exitosamente!");
    } catch (error: any) {
      toast.error(error.message || "Error al generar el tema");
      throw error;
    } finally {
      setIsGeneratingTopic(false);
    }
  }, [keywords]);

  // Generar texto
  const generateText = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedText("");

    try {
      // Usar tema generado o keywords como prompt
      const prompt = generatedTopic.trim() || keywords.trim() || "";

      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/lectures/generate-text`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            prompt,
            level: params.level,
            typeWrite: params.typeWrite,
            language: params.language,
            rangeMin: params.rangeMin,
            rangeMax: params.rangeMax,
            addEasyWords: params.addEasyWords,
            grammarTopics: params.grammarTopics,
            selectedWords: params.selectedWords,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate text");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let done = false;
      let currentText = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        const chunk = decoder.decode(value, { stream: true });
        currentText += chunk;
        setGeneratedText(currentText);
        textCallbackRef.current?.(currentText);
      }

      toast.success("¡Lectura generada exitosamente!");
    } catch (error: any) {
      toast.error(error.message || "Error al generar la lectura");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generatedTopic, keywords, params]);

  // Actualizar parámetro
  const updateParam = useCallback(<K extends keyof LectureParams>(
    key: K,
    value: LectureParams[K]
  ) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Reset parámetros
  const resetParams = useCallback(() => {
    setParams(DEFAULT_PARAMS);
  }, []);

  // Guardar lecture
  const saveLecture = useCallback(async (additionalData?: Partial<ILecture>) => {
    if (!generatedText.trim()) {
      toast.error("No hay texto generado para guardar");
      return;
    }

    try {
      const lectureData: ILecture = {
        content: generatedText,
        language: params.language,
        difficulty: params.level,
        typeWrite: params.typeWrite,
        time: additionalData?.time || 5, // Default 5 minutos
        ...additionalData,
      };

      await lectureService.postLecture(lectureData);
      toast.success("¡Lectura guardada exitosamente!");
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la lectura");
      throw error;
    }
  }, [generatedText, params]);

  // Regenerar
  const regenerate = useCallback(async () => {
    await generateText();
  }, [generateText]);

  // Limpiar preview
  const clearPreview = useCallback(() => {
    setGeneratedText("");
  }, []);

  // Limpiar tema
  const clearTopic = useCallback(() => {
    setGeneratedTopic("");
    setKeywords("");
  }, []);

  return {
    // Estado
    keywords,
    setKeywords,
    generatedTopic,
    isGeneratingTopic,
    generatedText,
    isGenerating,
    params,
    paramsModalOpen,
    setParamsModalOpen,
    
    // Tema
    generateTopic,
    
    // Generación
    generateText,
    
    // Parámetros
    updateParam,
    resetParams,
    
    // Acciones
    saveLecture,
    regenerate,
    clearPreview,
    clearTopic,
  };
}
