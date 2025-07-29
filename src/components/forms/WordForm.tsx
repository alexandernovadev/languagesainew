import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Word } from "@/models/Word";
import { wordLevels } from "@/data/wordLevels";
import { EditableList } from "./EditableList";
import { Book, Sparkles, ListPlus, Wand2, Loader2, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useResultHandler } from "@/hooks/useResultHandler";

interface WordFormProps {
  initialData?: Partial<Word>;
  onSubmit: (data: Partial<Word>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function WordForm({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
}: WordFormProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Partial<Word>>({
    defaultValues: {
      word: "",
      IPA: "",
      definition: "",
      examples: [],
      sinonyms: [],
      codeSwitching: [],
      level: "easy",
      language: "en",
      spanish: { word: "", definition: "" },
      img: "",
      ...initialData,
    },
  });

  const formData = watch();

  useEffect(() => {
    // Ensure arrays are not undefined when resetting form
    const dataWithArrays = {
      ...initialData,
      examples: initialData.examples || [],
      sinonyms: initialData.sinonyms || [],
      codeSwitching: initialData.codeSwitching || [],
      img: initialData.img || "",
    };
    reset(dataWithArrays);
  }, [initialData, reset]);

  const isFormValid = formData.word && formData.spanish?.word;

  const onSubmitForm = (data: Partial<Word>) => {
    if (isFormValid) {
      onSubmit(data);
    }
  };

  const handleChange = (field: keyof Word, value: any) => {
    setValue(field, value);
  };

  const handleSpanishChange = (field: "word" | "definition", value: string) => {
    setValue(`spanish.${field}`, value);
  };

  // Función para generar imagen con AI
  const handleGenerateImage = async () => {
    if (!formData.word) {
      toast.error("Necesitas una palabra para generar una imagen");
      return;
    }

    setIsGeneratingImage(true);
    setImageProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setImageProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Llamar al endpoint de generación de imagen para palabras
      const response = await api.post(
        `/api/ai/generate-image/${initialData._id || "temp"}`,
        {
          word: formData.word,
          imgOld: formData.img || "",
        }
      );

      clearInterval(progressInterval);
      setImageProgress(100);

      if (response.data.success) {
        // Actualizar el input con la nueva URL
        setValue("img", response.data.data.img);
        toast.success("Imagen generada exitosamente", {
          action: {
            label: <Eye className="h-4 w-4" />,
            onClick: () => handleApiResult({ success: true, data: { imageUrl: response.data.data.img }, message: "Imagen generada exitosamente" }, "Generar Imagen")
          },
          cancel: {
            label: <X className="h-4 w-4" />,
            onClick: () => toast.dismiss()
          }
        });
      } else {
        throw new Error("Error al generar imagen");
      }
    } catch (error: any) {
      handleApiResult(error, "Generar Imagen");
    } finally {
      setIsGeneratingImage(false);
      setImageProgress(0);
    }
  };

  return (
    <form
      id="word-form"
      onSubmit={handleSubmit(onSubmitForm)}
      className="flex flex-col flex-grow min-h-0"
    >
      <div className="flex-grow overflow-y-auto px-1 min-h-0">
        <Tabs defaultValue="basic" className="space-y-4">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">
                <Book className="h-4 w-4 mr-2" />
                Información Básica
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Sparkles className="h-4 w-4 mr-2" />
                Campos Avanzados
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic" className="pt-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalles Principales</CardTitle>
                <CardDescription>
                  Información esencial de la palabra en inglés y español.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="word">Palabra (Inglés)</Label>
                    <Input
                      id="word"
                      {...register("word", { required: true })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spanish-word">Traducción (Español)</Label>
                    <Input
                      id="spanish-word"
                      value={formData.spanish?.word || ""}
                      onChange={(e) =>
                        handleSpanishChange("word", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="definition">Definición (Inglés)</Label>
                  <Textarea
                    id="definition"
                    {...register("definition")}
                    placeholder="Escribe una definición detallada aquí..."
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Clasificación</CardTitle>
                <CardDescription>
                  Ayuda a organizar y filtrar tu vocabulario.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipa">IPA (Opcional)</Label>
                  <Input id="ipa" {...register("IPA")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Nivel de Dificultad</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleChange("level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {wordLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="pt-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListPlus className="h-5 w-5" /> Sinónimos
                </CardTitle>
                <CardDescription>
                  Palabras con significado similar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={formData.sinonyms || []}
                  onChange={(items) => handleChange("sinonyms", items)}
                  placeholder="Añadir sinónimo..."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListPlus className="h-5 w-5" /> Ejemplos de Uso
                </CardTitle>
                <CardDescription>
                  Palabras que se utilizan para ilustrar el uso de la palabra.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={formData.examples || []}
                  onChange={(items) => handleChange("examples", items)}
                  placeholder="Añadir ejemplo..."
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListPlus className="h-5 w-5" /> Code Switching
                </CardTitle>
                <CardDescription>
                  Expresiones que combinan idiomas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditableList
                  items={formData.codeSwitching || []}
                  onChange={(items) => handleChange("codeSwitching", items)}
                  placeholder="Añadir expresión..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagen</CardTitle>
                <CardDescription>
                  Añade una imagen representativa para la palabra (URL).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-1">
                    <Label>Vista Previa</Label>
                    <div className="mt-2 w-full aspect-video rounded-md border flex items-center justify-center bg-muted relative overflow-hidden">
                      {isGeneratingImage ? (
                        // Skeleton durante generación
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-muted-foreground">
                            Generando imagen...
                          </p>
                          {imageProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${imageProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ) : formData.img ? (
                        <img
                          src={formData.img}
                          alt={formData.word || "Word image"}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <img
                            src="/placeholder.svg"
                            alt="No image available"
                            className="w-20 h-20 opacity-50"
                          />
                          <p className="text-sm mt-2">Sin imagen</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="img">URL de la Imagen</Label>
                      <div className="flex gap-2">
                        <Input
                          id="img"
                          {...register("img")}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          disabled={isGeneratingImage}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateImage}
                          disabled={isGeneratingImage || !formData.word}
                          className="whitespace-nowrap"
                        >
                          {isGeneratingImage ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generando...
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4 mr-2" />
                              Generar con AI
                            </>
                          )}
                        </Button>
                      </div>
                      {!formData.word && (
                        <p className="text-xs text-muted-foreground">
                          Necesitas una palabra para generar una imagen
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


    </form>
  );
}
