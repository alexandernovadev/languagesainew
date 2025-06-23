import { useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, FileText } from "lucide-react";
import { lectureTypes } from "@/data/lectureTypes";
import { lectureLevels } from "@/data/lectureLevels";
import { languageData } from "@/data/languageData";
import type { Lecture } from "@/models/Lecture";

interface LectureFormProps {
  initialData?: Partial<Lecture>;
  onSubmit: (
    data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Omit<Lecture, "_id" | "createdAt" | "updatedAt">>({
    defaultValues: {
      time: 0,
      level: "",
      typeWrite: "",
      language: "",
      img: "",
      urlAudio: "",
      content: "",
      ...initialData,
    },
  });

  const formData = watch();

  const isFormValid =
    formData.content &&
    formData.level &&
    formData.language &&
    formData.typeWrite;

  const onSubmitForm = async (data: Omit<Lecture, "_id" | "createdAt" | "updatedAt">) => {
    if (isFormValid) {
      await onSubmit(data);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col h-full">
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
                        Nivel de Dificultad <span className="text-red-500">*</span>
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
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="typeWrite">
                        Tipo de Contenido <span className="text-red-500">*</span>
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
                          {languageData.map((lang) => (
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
                      <div className="mt-2 w-full aspect-video rounded-md border flex items-center justify-center bg-muted">
                        {formData.img ? (
                          <img
                            src={formData.img}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = "/images/noImage.png";
                            }}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">Sin Imagen</p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="img">URL de la Imagen</Label>
                      <Input
                        id="img"
                        {...register("img")}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
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
          <Button type="submit" disabled={!isFormValid || loading}>
            {loading ? "Guardando..." : submitText}
          </Button>
        </div>
      </form>
    </div>
  );
}
