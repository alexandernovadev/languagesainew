import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Settings, FileText, Image } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Lecture } from "@/models/Lecture";
import { lectureLevels } from "@/data/lectureLevels";
import { lectureTypes } from "@/data/lectureTypes";
import { getAllowedLanguages } from "@/constants/identity";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";
import { ImageUploaderCard } from "@/shared/components/ui/ImageUploaderCard";

interface LectureFormProps {
  initialData?: Partial<Lecture>;
  onSubmit: (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitText?: string;
}

export function LectureForm({ initialData = {}, onSubmit }: LectureFormProps) {
  // Hook para manejo de errores
  // TODO esto no se usa
  const { handleApiResult } = useResultHandler();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      level: initialData.level || "",
      typeWrite: initialData.typeWrite || "",
      language: initialData.language || "en",
      time: initialData.time || 1,
      content: initialData.content || "",
      img: initialData.img || "",
    },
  });

  const formData = watch();

  const isFormValid =
    formData.content &&
    formData.level &&
    formData.language &&
    formData.typeWrite &&
    formData.time > 0;

  const onSubmitForm = async (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => {
    if (isFormValid) {
      await onSubmit(data);
    } else {
      toast.error("Por favor completa todos los campos requeridos", {
        description:
          "Nivel, tipo de contenido, idioma, contenido y duración (mayor a 0) son obligatorios",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form
        id="lecture-form"
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex flex-col h-full"
      >
        <Tabs defaultValue="config" className="flex flex-col flex-grow min-h-0">
          <div className="px-6 py-2">
            {/* Contenedor con scroll horizontal en móvil */}
            <div className="max-sm:overflow-x-auto max-sm:pb-2">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 max-sm:flex max-sm:w-max max-sm:min-w-full">
                <TabsTrigger
                  value="config"
                  className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Configuración</span>
                  <span className="sm:hidden">Config</span>
                </TabsTrigger>
                <TabsTrigger
                  value="multimedia"
                  className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap"
                >
                  <Image className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Multimedia</span>
                  <span className="sm:hidden">Media</span>
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Contenido</span>
                  <span className="sm:hidden">Contenido</span>
                </TabsTrigger>
              </TabsList>
            </div>
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
                      <Label htmlFor="difficulty">
                        Dificultad{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setValue("difficulty", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una dificultad" />
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
                          {getAllowedLanguages().map((lang: any) => (
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
                      <Label htmlFor="time">
                        Duración (min) <span className="text-red-500">*</span>
                      </Label>
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
            </TabsContent>

            <TabsContent value="multimedia" className="p-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Multimedia</CardTitle>
                  <CardDescription>
                    Añade una imagen de portada para la lectura.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ImageUploaderCard
                      entityType="lecture"
                      entityId={initialData._id || ""}
                      imageUrl={formData.img}
                      onImageChange={(newImageUrl) =>
                        setValue("img", newImageUrl)
                      }
                      disabled={!initialData._id}
                      word={formData.content || ""}
                    />

                    {!initialData._id && (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        💡 <strong>Tip:</strong> Guarda la lección primero para
                        poder subir imágenes personalizadas.
                      </div>
                    )}
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
      </form>
    </div>
  );
}
