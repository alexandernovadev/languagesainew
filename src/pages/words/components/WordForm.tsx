import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { IWord } from "@/types/models/Word";
import { wordLevels } from "@/data/wordLevels";
import { EditableList } from "@/shared/components/forms/EditableList";
import { Book, Sparkles, ListPlus, Stars, Image } from "lucide-react";
import { ImageUploaderCard } from "@/shared/components/ui/ImageUploaderCard";
import { capitalize } from "@/utils/common/string/capitalize";
import { getAllLanguages } from "@/utils/common/language";
import { WORD_TYPES } from "@/utils/constants/wordTypes";
import { useResultHandler } from "@/shared/hooks/useResultHandler";

interface WordFormProps {
  initialData?: Partial<IWord>;
  onSubmit: (data: Partial<IWord>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function WordForm({
  initialData = {},
  onSubmit,
  loading = false,
}: WordFormProps) {
  // Hook para manejo de errores
  // TODO esto no se usa
  const { handleApiResult } = useResultHandler();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<Partial<IWord>>({
    defaultValues: {
      word: "",
      IPA: "",
      definition: "",
      examples: [],
      sinonyms: [],
      codeSwitching: [],
      difficulty: "easy",
      language: "en",
      spanish: { word: "", definition: "" },
      img: "",
      type: [],
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

  const isFormValid = formData.word && formData.spanish?.word && formData.spanish?.definition;

  const onSubmitForm = (data: Partial<IWord>) => {
    if (isFormValid) {
      onSubmit(data);
    }
  };

  const handleChange = (field: keyof IWord, value: any) => {
    setValue(field, value);
  };

  const handleSpanishChange = (field: "word" | "definition", value: string) => {
    setValue(`spanish.${field}`, value);
  };

  const handleImageChange = (imageUrl: string) => {
    setValue("img", imageUrl);
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
            {/* Contenedor con scroll horizontal en móvil */}
            <div className="max-sm:overflow-x-auto max-sm:pb-2">
              <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 max-sm:flex max-sm:w-max max-sm:min-w-full">
                <TabsTrigger value="basic" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Book className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Información Básica</span>
                  <span className="sm:hidden">Básica</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Image className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Imagen</span>
                  <span className="sm:hidden">Imagen</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Campos Avanzados</span>
                  <span className="sm:hidden">Avanzados</span>
                </TabsTrigger>
                <TabsTrigger value="anki" className="max-sm:flex-shrink-0 max-sm:whitespace-nowrap">
                  <Stars className="h-4 w-4 mr-2" />
                  <span className="max-sm:hidden sm:inline">Sistema Anki</span>
                  <span className="sm:hidden">Anki</span>
                </TabsTrigger>
              </TabsList>
            </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipos de Palabra</Label>
                    <Card>
                      <CardContent className="p-3">
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {WORD_TYPES.map((type) => (
                            <div key={type.key} className="flex items-start space-x-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors">
                              <Checkbox
                                id={`type-${type.key}`}
                                checked={formData.type?.includes(type.key) || false}
                                onCheckedChange={(checked) => {
                                  const currentTypes = formData.type || [];
                                  if (checked) {
                                    handleChange("type", [...currentTypes, type.key]);
                                  } else {
                                    handleChange("type", currentTypes.filter((t: string) => t !== type.key));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`type-${type.key}`}
                                className="flex flex-col cursor-pointer flex-1 min-w-0"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="text-base">{type.icon}</span>
                                  <span className="font-medium text-sm">{type.label}</span>
                                </div>
                                <span className="text-xs text-muted-foreground ml-5">
                                  {type.key}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <p className="text-xs text-muted-foreground">
                      Selecciona uno o más tipos gramaticales para esta palabra
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleChange("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un idioma">
                            {formData.language && (() => {
                              const lang = getAllLanguages().find(l => l.code === formData.language);
                              return lang ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{lang.flag}</span>
                                  <span>{lang.name}</span>
                                </div>
                              ) : formData.language;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getAllLanguages().map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seen">Contador de Vistas</Label>
                      <Input
                        id="seen"
                        type="number"
                        min="0"
                        {...register("seen", { valueAsNumber: true })}
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Número de veces que se ha visto esta palabra
                      </p>
                    </div>
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
                <div className="space-y-2">
                  <Label htmlFor="spanish-definition">Definición (Español)</Label>
                  <Textarea
                    id="spanish-definition"
                    value={formData.spanish?.definition || ""}
                    onChange={(e) =>
                      handleSpanishChange("definition", e.target.value)
                    }
                    placeholder="Escribe una definición detallada en español..."
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
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      {wordLevels.map((level: string) => (
                        <SelectItem key={level} value={level}>
                          {capitalize(level)}
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
                  onChange={(items: string[]) => handleChange("sinonyms", items)}
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
                  onChange={(items: string[]) => handleChange("examples", items)}
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
                  onChange={(items: string[]) => handleChange("codeSwitching", items)}
                  placeholder="Añadir expresión..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="pt-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" /> Imagen
                </CardTitle>
                <CardDescription>
                  Arrastra una imagen, genera una con AI, o ingresa una URL manualmente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploaderCard
                  title=""
                  description=""
                  imageUrl={formData.img || ""}
                  onImageChange={handleImageChange}
                  word={formData.word}
                  entityId={(initialData as any)?._id}
                  entityType="word"
                  disabled={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anki tab removed - fields not in IWord model */}
          <TabsContent value="anki" className="pt-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stars className="h-5 w-5" /> Sistema de Repaso Inteligente
                </CardTitle>
                <CardDescription>
                  Los campos de Anki no están disponibles en el modelo actual.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Esta funcionalidad será implementada en una futura versión.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}
