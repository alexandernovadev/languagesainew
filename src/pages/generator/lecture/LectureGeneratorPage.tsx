import { useRef, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";
import ReactMarkdown from "react-markdown";
import { Save, BookOpen, Loader2, Settings } from "lucide-react";
import { useTopicGenerator } from "@/hooks/useTopicGenerator";
import { TopicGeneratorButton } from "@/components/common/TopicGeneratorButton";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useNavigate } from "react-router-dom";

import { lectureTypes } from "@/data/lectureTypes";
import { lectureLevels } from "@/data/lectureLevels";
import { useLectureStore } from "../../lectures/store/useLectureStore";
import { LectureGeneratorConfigModal } from "../../lectures/components/LectureGeneratorConfigModal";
import { Lecture } from "@/models/Lecture";
import { getAuthHeaders } from "@/utils/services";
import { wordService } from "@/services/wordService";
import { ActionButtonsHeader } from "@/components/ui/action-buttons-header";

const generatorFormSchema = z.object({
  // Permitir vacío (random). Si no está vacío, mínimo 120 caracteres
  prompt: z
    .string()
    .max(600, { message: "El tema no debe exceder los 600 caracteres." })
    .refine((val) => val.trim().length === 0 || val.trim().length >= 120, {
      message:
        "El tema debe tener al menos 120 caracteres o estar vacío para generar aleatorio.",
    }),
  typeWrite: z.string(),
  level: z.string(),
  difficulty: z.string(),
  addEasyWords: z.boolean(),
});

type GeneratorFormData = z.infer<typeof generatorFormSchema>;

export default function LectureGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Añadir estados locales para language, rangeMin, rangeMax, grammarTopics
  const [language, setLanguage] = useState("en");
  const [rangeMin, setRangeMin] = useState(5200);
  const [rangeMax, setRangeMax] = useState(6500);
  const [grammarTopics, setGrammarTopics] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [preloadedWords, setPreloadedWords] = useState<
    Record<string, { word: string }[]>
  >({});
  const [isLoadingWords, setIsLoadingWords] = useState(false);

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  // Topic generator hook
  const { isGenerating: isGeneratingTopic, generateTopic } = useTopicGenerator({
    type: "lecture",
    onTopicGenerated: (topic) => {
      // Actualizar el campo y disparar validación para que
      // isValid se actualice sin intervención manual.
      setValue("prompt", topic, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
  });

  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { postLecture } = useLectureStore();

  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    register,
    formState: { isValid },
  } = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorFormSchema),
    mode: "onChange",
    defaultValues: {
      prompt: "",
      typeWrite: "blog",
      level: "B2",
      difficulty: "medium",
      addEasyWords: false,
    },
  });

  const watchedValues = watch();

  // Cargar todas las palabras al montar el componente
  useEffect(() => {
    const loadAllWords = async () => {
      setIsLoadingWords(true);
      try {
        const wordTypes = [
          "noun",
          "verb",
          "adjective",
          "adverb",
          "preposition",
          "conjunction",
          "personal pronoun",
          "possessive pronoun",
          "article",
          "determiner",
          "quantifier",
          "interjection",
          "auxiliary verb",
          "modal verb",
          "infinitive",
          "participle",
          "gerund",
          "phrasal verb",
          "other",
        ];

        const wordsByType: Record<string, { word: string }[]> = {};

        // Cargar palabras de cada tipo en paralelo
        await Promise.all(
          wordTypes.map(async (type) => {
            try {
              const words = await wordService.getWordsByTypeOptimized(type, 10);
              wordsByType[type] = words;
            } catch (error) {
              console.error(`Error loading ${type} words:`, error);
              handleApiResult(error, `Cargar Palabras ${type}`);
              wordsByType[type] = [];
            }
          })
        );

        setPreloadedWords(wordsByType);
      } catch (error) {
        console.error("Error loading words:", error);
        handleApiResult(error, "Cargar Palabras");
      } finally {
        setIsLoadingWords(false);
      }
    };

    loadAllWords();
  }, []);



  const handleGenerateText = async (data: GeneratorFormData) => {
    setIsGenerating(true);
    setGeneratedText("");

    try {
      // Usar fetch para streaming ya que axios no maneja streaming fácilmente
      const promptToSend = (data.prompt || "").trim();
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/ai/generate-text`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            // Allow empty prompt → backend will generate random; if not empty, use user's ideas
            prompt: promptToSend,
            level: data.level,
            typeWrite: data.typeWrite,
            language,
            rangeMin,
            rangeMax,
            grammarTopics,
            selectedWords,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate text");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let currentText = "";

      while (!done) {
        const { value, done: streamDone } = await reader!.read();
        done = streamDone;
        const chunk = decoder.decode(value, { stream: true });
        currentText += chunk;
        setGeneratedText(currentText);

        // Auto-scroll to bottom
        if (textRef.current) {
          textRef.current.scrollTop = textRef.current.scrollHeight;
        }
      }

      toast.success("¡Lectura generada exitosamente!");
    } catch (error: any) {
      handleApiResult(error, "Generar Lectura");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLecture = async () => {
    if (!generatedText.trim()) {
      toast.error("No hay contenido para guardar");
      return;
    }

    setIsSaving(true);
    const data = getValues();

    const lecture = {
      time: 0, // No se calcula aquí, se hace en el backend
      level: data.level,
      typeWrite: data.typeWrite,
      language: language, // Usar el estado language en lugar de hardcodear "es"
      img: "",
      content: generatedText,
    } as Lecture;

    try {
      await postLecture(lecture);
      toast.success("¡Lectura guardada exitosamente!");
      navigate("/lectures");
    } catch (error: any) {
      handleApiResult(error, "Guardar Lectura");
    } finally {
      setIsSaving(false);
    }
  };

  // Sincronizar config con valores actuales al abrir el modal
  const openConfigModal = () => {
    // ✅ SOLUCIÓN: Sincronizar la configuración ANTES de abrir el modal
    // Los estados locales ya están sincronizados, solo abrir el modal
    setIsConfigOpen(true);
  };

  // Guardar cambios del modal en el formulario principal
  const handleSaveConfig = (config: {
    level: string;
    typeWrite: string;
    difficulty: string;
    language: string;
    rangeMin: number;
    rangeMax: number;
    grammarTopics: string[];
    selectedWords: string[];
  }) => {
    // ✅ SOLUCIÓN: Actualizar tanto el formulario como los estados locales
    setValue("level", config.level);
    setValue("typeWrite", config.typeWrite);
    setValue("difficulty", config.difficulty);
    setLanguage(config.language);
    setRangeMin(config.rangeMin);
    setRangeMax(config.rangeMax);
    setGrammarTopics(config.grammarTopics);
    setSelectedWords(config.selectedWords);
    
    // ✅ SOLUCIÓN: Forzar la validación del formulario
    // trigger() no está disponible, pero setValue ya dispara la validación
  };

  const handleGenerateTopic = async () => {
    const currentPrompt = getValues("prompt");
    await generateTopic(currentPrompt);
  };

  // ✅ SOLUCIÓN: Crear initialConfig dinámicamente usando useMemo
  const initialConfig = useMemo(() => ({
    level: watchedValues.level,
    typeWrite: watchedValues.typeWrite,
    difficulty: watchedValues.difficulty,
    language,
    rangeMin,
    rangeMax,
    grammarTopics,
    selectedWords,
    preloadedWords,
  }), [
    watchedValues.level,
    watchedValues.typeWrite, 
    watchedValues.difficulty,
    language,
    rangeMin,
    rangeMax,
    grammarTopics,
    selectedWords,
    preloadedWords
  ]);

  return (
    <PageLayout>
      <PageHeader
        title="Lecture Generator"
        description="Genera lecturas personalizadas con IA."
        actions={
          <div className="flex items-center gap-2">
            <ActionButtonsHeader
              actions={[
                {
                  id: "config",
                  icon: <Settings className="h-4 w-4" />,
                  onClick: openConfigModal,
                  tooltip: "Configuración avanzada",
                  variant: "outline"
                }
              ]}
            />
            <LectureGeneratorConfigModal
              open={isConfigOpen}
              onOpenChange={setIsConfigOpen}
              initialConfig={initialConfig}
              onSave={handleSaveConfig}
              lectureLevels={lectureLevels}
              lectureTypes={lectureTypes}
            />
          </div>
        }
      />

      <div className="grid gap-6">
        {/* Generación principal */}
        <form id="lectureGeneratorForm" onSubmit={handleSubmit(handleGenerateText)}>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label
                  htmlFor="mainPrompt"
                  className={isGenerating ? "shimmer-text" : undefined}
                >
                  Tema de la Lectura
                </Label>
                <div className="space-y-2">
                  <Textarea
                    id="mainPrompt"
                    placeholder="Escribe palabras clave o describe el tema (ej: 'gramática', 'viajes', 'tecnología'...). La IA te ayudará a expandir la idea."
                    {...register("prompt")}
                    rows={3}
                    disabled={isGenerating || isGeneratingTopic}
                  />
                  <div className="flex items-center justify-between">
                    <TopicGeneratorButton
                      onClick={handleGenerateTopic}
                      isGenerating={isGeneratingTopic}
                      disabled={isGenerating}
                    />
                    <p className={`text-xs text-muted-foreground`}>
                      {watchedValues.prompt.length} / 600 caracteres
                    </p>
                  </div>
                  
                  {/* 🔄 Botón de Generar Lectura debajo del input */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      form="lectureGeneratorForm"
                      disabled={isGenerating || !isValid}
                      className="gap-2 px-8 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="shimmer-text">Generando...</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4" />
                          Generar Lectura
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Área de generación */}
        {generatedText && (
          <Card>
            <CardHeader>
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Lectura Generada</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`border rounded px-3 py-1 text-sm font-medium bg-transparent border-blue-500 ${
                        watchedValues.level
                          ? "text-blue-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      Nivel: {watchedValues.level}
                    </span>
                    <span
                      className={`border rounded px-3 py-1 text-sm font-medium bg-transparent border-green-500 ${
                        watchedValues.typeWrite
                          ? "text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      Tipo: {watchedValues.typeWrite}
                    </span>
                    <span
                      className={`border rounded px-3 py-1 text-sm font-medium bg-transparent border-purple-500 ${
                        watchedValues.addEasyWords
                          ? "text-purple-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      Vocabulario adicional:{" "}
                      {watchedValues.addEasyWords ? "Sí" : "No"}
                    </span>
                    {grammarTopics.length > 0 && (
                      <span
                        className={`border rounded px-3 py-1 text-sm font-medium bg-transparent border-orange-500 text-orange-400`}
                      >
                        Gramática: {grammarTopics.length} tema
                        {grammarTopics.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </>
            </CardHeader>
            <CardContent>
              <div
                ref={textRef}
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:scroll-m-20 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-p:text-base prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-strong:font-semibold prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-li:marker:text-muted-foreground prose-ul:list-disc prose-ol:list-decimal prose-hr:border-muted-foreground/20 break-words"
              >
                <ReactMarkdown>{generatedText}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Botón flotante de guardar */}
      <Button
        variant="default"
        size="icon"
        onClick={handleSaveLecture}
        disabled={isSaving || isGenerating || !generatedText.trim()}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isSaving ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Save className="h-6 w-6" />
        )}
      </Button>
    </PageLayout>
  );
}
