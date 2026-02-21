import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { examService } from "@/services/examService";
import type {
  ExamQuestionType,
  GenerateExamParams,
  GeneratedExam,
  ValidationResult,
} from "@/types/models";

export type ExamGeneratorStep = 1 | 2 | 3;

interface ExamGeneratorParams {
  language: string;
  difficulty: string;
  grammarTopics: string[];
  questionTypes: ExamQuestionType[];
  questionCount: number;
  topic: string;
}

const DEFAULT_PARAMS: ExamGeneratorParams = {
  language: "en",
  difficulty: "B1",
  grammarTopics: [],
  questionTypes: ["multiple"],
  questionCount: 10,
  topic: "",
};

export function useExamGenerator() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ExamGeneratorStep>(1);
  const [params, setParams] = useState<ExamGeneratorParams>(DEFAULT_PARAMS);
  const [generatedExam, setGeneratedExam] = useState<GeneratedExam | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateParam = useCallback(<K extends keyof ExamGeneratorParams>(
    key: K,
    value: ExamGeneratorParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const generate = useCallback(async () => {
    if (!params.grammarTopics.length) {
      toast.error("Selecciona al menos un tema de gramática");
      return;
    }
    if (params.questionTypes.length === 0) {
      toast.error("Selecciona al menos un tipo de pregunta");
      return;
    }
    if (params.questionCount < 5 || params.questionCount > 20) {
      toast.error("Cantidad de preguntas debe ser entre 5 y 20");
      return;
    }

    setStep(2);
    setIsGenerating(true);
    setGeneratedExam(null);
    setValidationResult(null);

    try {
      const apiParams: GenerateExamParams = {
        language: params.language,
        grammarTopics: params.grammarTopics,
        difficulty: params.difficulty,
        questionCount: params.questionCount,
        questionTypes: params.questionTypes,
        topic: params.topic.trim() || undefined,
      };

      const result = await examService.generate(apiParams);
      setGeneratedExam(result);
      setStep(3);
      toast.success("¡Examen generado!");
    } catch (error: any) {
      toast.error(error.message || "Error al generar el examen");
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  }, [params]);

  const validate = useCallback(async () => {
    if (!generatedExam) return;

    setIsValidating(true);
    try {
      const result = await examService.validate(generatedExam);
      setValidationResult(result);
      toast.success(result.thumbsUp ? "Examen validado ✓" : "Revisa los issues");
    } catch (error: any) {
      toast.error(error.message || "Error al validar");
    } finally {
      setIsValidating(false);
    }
  }, [generatedExam]);

  const correct = useCallback(async () => {
    if (!generatedExam || !validationResult) return;

    setIsCorrecting(true);
    try {
      const result = await examService.correct(generatedExam, validationResult);
      setGeneratedExam(result);
      setValidationResult(null);
      toast.success("Examen corregido. Verifica de nuevo si quieres.");
    } catch (error: any) {
      toast.error(error.message || "Error al corregir");
    } finally {
      setIsCorrecting(false);
    }
  }, [generatedExam, validationResult]);

  const save = useCallback(async () => {
    if (!generatedExam) return;

    setIsSaving(true);
    try {
      const exam = await examService.create({
        title: generatedExam.title,
        language: params.language as any,
        difficulty: params.difficulty as any,
        grammarTopics: params.grammarTopics,
        topic: params.topic.trim() || undefined,
        questions: generatedExam.questions,
      });
      toast.success("¡Examen guardado!");
      navigate("/exams");
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  }, [generatedExam, params, navigate]);

  const resetToParams = useCallback(() => {
    setStep(1);
    setGeneratedExam(null);
    setValidationResult(null);
  }, []);

  return {
    step,
    params,
    updateParam,
    generatedExam,
    validationResult,
    isGenerating,
    isValidating,
    isCorrecting,
    isSaving,
    generate,
    validate,
    correct,
    save,
    resetToParams,
  };
}
