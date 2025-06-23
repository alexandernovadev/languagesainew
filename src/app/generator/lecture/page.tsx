import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Save, Download, Settings, BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import { PageLayout } from "@/components/layouts/page-layout";
import { useNavigate } from "react-router-dom";

import { lectureTypes } from "@/data/lectureTypes";
import { lectureLevels } from "@/data/lectureLevels";
import { useLectureStore } from "@/lib/store/useLectureStore";
import { Lecture } from "@/models/Lecture";
import { calculateReadingTime, escapeMarkdown } from "@/utils";
import { getAuthHeaders } from "@/services/utils/headers";

interface GeneratorFormData {
  prompt: string;
  typeWrite: string;
  level: string;
  difficulty: string;
  addEasyWords: boolean;
}

export default function LectureGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { postLecture } = useLectureStore();

  const { handleSubmit, control, getValues, setValue, watch } =
    useForm<GeneratorFormData>({
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

      while (!done) {
        const { value, done: streamDone } = await reader!.read();
        done = streamDone;
        const chunk = decoder.decode(value, { stream: true });
        setGeneratedText((prevText) => {
          const newText = prevText + chunk;
          return escapeMarkdown(newText);
        });

        // Auto-scroll to bottom
        if (textRef.current) {
          textRef.current.scrollTop = textRef.current.scrollHeight;
        }
      }

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

    const lecture: Lecture = {
      _id: "",
      time: calculateReadingTime(generatedText),
      level: data.level,
      typeWrite: data.typeWrite,
      language: "es",
      img: "",
      content: generatedText,
    };

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

  const handleAdvancedGenerate = () => {
    const data = getValues();
    if (!data.prompt.trim()) {
      toast.error("Por favor ingresa un tema para la lectura");
      return;
    }
    handleGenerateText(data);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Lecture Generator"
        description="Crea lecturas y material educativo con IA en tiempo real"
        actions={
          <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configuración Avanzada
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configuración Avanzada</DialogTitle>
                <DialogDescription>
                  Define parámetros adicionales para tu lectura
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="advancedType">Tipo de Contenido</Label>
                    <Select
                      value={watchedValues.typeWrite}
                      onValueChange={(value) => setValue("typeWrite", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {lectureTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advancedLevel">Nivel</Label>
                    <Select
                      value={watchedValues.level}
                      onValueChange={(value) => setValue("level", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        {lectureLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select
                      value={watchedValues.difficulty}
                      onValueChange={(value) => setValue("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Medio</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addEasyWords">
                      Incluir palabras fáciles
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="addEasyWords"
                        className="mt-2"
                        checked={watchedValues.addEasyWords}
                        onCheckedChange={(checked) =>
                          setValue("addEasyWords", checked as boolean)
                        }
                      />
                      <Label htmlFor="addEasyWords" className="text-sm mt-3">
                        30 palabras fáciles
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdvancedOpen(false)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-6">
        {/* Generación principal */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="mainPrompt">Tema de la Lectura</Label>
              <Textarea
                id="mainPrompt"
                placeholder="Describe el tema principal de la lectura..."
                {...control.register("prompt")}
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleAdvancedGenerate}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generando...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Generar Lectura
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Área de generación */}
        {generatedText && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lectura Generada
                </CardTitle>
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
              </div>
              <CardDescription>
                Tiempo de lectura estimado:{" "}
                {calculateReadingTime(generatedText)} minutos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={textRef}
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:scroll-m-20 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-p:text-base prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-strong:font-semibold prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-li:marker:text-muted-foreground prose-ul:list-disc prose-ol:list-decimal prose-hr:border-muted-foreground/20"
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
