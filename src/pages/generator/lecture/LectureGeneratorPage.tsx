import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Save, Download, BookOpen, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useNavigate } from "react-router-dom";

import { lectureTypes } from "@/data/lectureTypes";
import { lectureLevels } from "@/data/lectureLevels";
import { useLectureStore } from "@/lib/store/useLectureStore";
import { Lecture } from "@/models/Lecture";
import { calculateReadingTime } from "@/utils/common/time";
import { getAuthHeaders } from "@/utils/services";

const generatorFormSchema = z.object({
  prompt: z
    .string()
    .min(60, { message: "El tema debe tener al menos 60 caracteres." })
    .max(500, { message: "El tema no debe exceder los 500 caracteres." }),
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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);

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

  const handleGenerateText = async (data: GeneratorFormData) => {
    setIsGenerating(true);
    setGeneratedText("");
    setEstimatedTime(0);

    try {
      // Usar fetch para streaming ya que axios no maneja streaming fácilmente
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/ai/generate-text`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            prompt: data.prompt,
            level: data.level,
            typeWrite: data.typeWrite,
            addEasyWords: data.addEasyWords,
            difficulty: data.difficulty,
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

      setEstimatedTime(calculateReadingTime(currentText));
      toast.success("¡Lectura generada exitosamente!");
    } catch (error) {
      console.error("Error generating text:", error);
      toast.error("Error al generar la lectura");
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
      time: estimatedTime,
      level: data.level,
      typeWrite: data.typeWrite,
      language: "es",
      img: "",
      content: generatedText,
    } as Lecture;

    try {
      await postLecture(lecture);
      toast.success("¡Lectura guardada exitosamente!");
      navigate("/lectures");
    } catch (error) {
      console.error("Error saving lecture:", error);
      toast.error("Error al guardar la lectura");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Lecture Generator"
        description="Genera lecturas personalizadas con IA."
      />

      <div className="grid gap-6">
        {/* Generación principal */}
        <form onSubmit={handleSubmit(handleGenerateText)}>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label
                    htmlFor="mainPrompt"
                    className={isGenerating ? "shimmer-text" : undefined}
                  >
                    Tema de la Lectura
                  </Label>
                  <Button
                    type="submit"
                    disabled={isGenerating || !isValid}
                    className={`gap-2`}
                    style={{ minWidth: 140 }}
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
                <Textarea
                  id="mainPrompt"
                  placeholder="Describe el tema principal de la lectura..."
                  {...register("prompt")}
                  rows={3}
                  disabled={isGenerating}
                />
                <p className={`text-xs text-right text-muted-foreground`}>
                  {watchedValues.prompt.length} / 500 caracteres
                </p>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Área de generación */}
        {generatedText && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                {estimatedTime > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveLecture}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Guardar
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                )}
              </div>

              <>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="border rounded px-3 py-1 text-sm font-medium bg-transparent border-green-500 text-green-400">
                    Nivel:{" "}
                    {lectureLevels.find((l) => l.value === watchedValues.level)
                      ?.label || watchedValues.level}
                  </span>
                  <span className="border rounded px-3 py-1 text-sm font-medium bg-transparent border-blue-500 text-blue-400">
                    Tipo:{" "}
                    {lectureTypes.find(
                      (t) => t.value === watchedValues.typeWrite
                    )?.label || watchedValues.typeWrite}
                  </span>
                  <span
                    className={`border rounded px-3 py-1 text-sm font-medium bg-transparent ${
                      watchedValues.difficulty === "easy"
                        ? "border-green-500 text-green-400"
                        : watchedValues.difficulty === "medium"
                        ? "border-yellow-500 text-yellow-400"
                        : "border-red-500 text-red-400"
                    }`}
                  >
                    Dificultad:{" "}
                    {watchedValues.difficulty === "easy"
                      ? "Fácil"
                      : watchedValues.difficulty === "medium"
                      ? "Media"
                      : "Difícil"}
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
                </div>
                {estimatedTime > 0 && (
                  <CardDescription>
                    Tiempo de lectura estimado: {estimatedTime} minutos
                  </CardDescription>
                )}
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
    </PageLayout>
  );
}
