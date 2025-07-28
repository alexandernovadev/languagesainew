import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, FileText, Wand2, Loader2 } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Lecture } from "@/models/Lecture";
import { lectureLevels } from "@/data/lectureLevels";
import { lectureTypes } from "@/data/lectureTypes";
import { getAllLanguages } from "@/utils/common/language";
import { api } from "@/services/api";
import { toast } from "sonner";

interface LectureFormProps {
  initialData?: Partial<Lecture>;
  onSubmit: (data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitText?: string;
}

export function LectureForm({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Guardar",
}: LectureFormProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      level: initialData.level || "",
      typeWrite: initialData.typeWrite || "",
      language: initialData.language || "en", // Cambiar de "es" a "en" como default más neutral
      time: initialData.time || 0,
      content: initialData.content || "",
      img: initialData.img || "",
    },
  });

  const formData = watch();

  const isFormValid =
    formData.content &&
    formData.level &&
    formData.language &&
    formData.typeWrite;

  // Función para generar imagen con AI
  const handleGenerateImage = async () => {
    if (!formData.content) {
      toast.error("Necesitas contenido para generar una imagen");
      return;
    }

    setIsGeneratingImage(true);
    setImageProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setImageProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Llamar al endpoint de generación de imagen
      const response = await api.post(`/api/ai/generate-image-lecture/${initialData._id || 'temp'}`, {
        lectureString: formData.content.substring(0, 500), // Primeros 500 caracteres
        imgOld: formData.img || null,
      });

      clearInterval(progressInterval);
      setImageProgress(100);

      if (response.data.success) {
        // Actualizar el input con la nueva URL
        setValue("img", response.data.data.img);
        toast.success("Imagen generada exitosamente");
      } else {
        throw new Error("Error al generar imagen");
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast.error(error.response?.data?.message || "Error al generar imagen");
    } finally {
      setIsGeneratingImage(false);
      setImageProgress(0);
    }
  };

  const onSubmitForm = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    if (isFormValid) {
      await onSubmit(data);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex flex-col h-full"
      >
        <Tabs defaultValue="config" className="flex flex-col flex-grow min-h-0">
          <div className="px-6 py-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                Contenido
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-grow overflow-y-auto">
            <TabsContent value="config" className="p-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Clasifica la lectura por nivel, tipo, idioma y duración
                    estimada.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="level">
                        Nivel de Dificultad{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => setValue("level", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un nivel" />
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

                    <div className="space-y-2">
                      <Label htmlFor="typeWrite">
                        Tipo de Contenido{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.typeWrite}
                        onValueChange={(value) => setValue("typeWrite", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
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
                      <Label htmlFor="language">
                        Idioma <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setValue("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAllLanguages().map((lang: any) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{lang.flag}</span>
                                <span>
                                  {lang.name} ({lang.code})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Duración (min)</Label>
                      <Input
                        id="time"
                        type="number"
                        {...register("time", { valueAsNumber: true })}
                        placeholder="Ej: 15"
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Multimedia</CardTitle>
                  <CardDescription>
                    Añade una imagen de portada para la lectura (URL).
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
                            <p className="text-sm text-muted-foreground">Generando imagen...</p>
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
                            alt="Preview"
                            className="w-full h-full object-contain rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = "/images/noImage.png";
                            }}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Sin Imagen
                          </p>
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
                            disabled={isGeneratingImage || !formData.content}
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
                        {!formData.content && (
                          <p className="text-xs text-muted-foreground">
                            Necesitas contenido para generar una imagen
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="h-full">
              <div className="p-4 h-full">
                <div data-color-mode="dark" className="h-full">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setValue("content", value || "")}
                    height="100%"
                    preview="live"
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 pb-4 border-t shrink-0 bg-background px-6">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isFormValid || loading || isGeneratingImage}>
            {loading ? "Guardando..." : submitText}
          </Button>
        </div>
      </form>
    </div>
  );
}
