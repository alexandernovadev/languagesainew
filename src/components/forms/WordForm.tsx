import { useEffect } from "react";
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
import { Book, Sparkles, ListPlus } from "lucide-react";

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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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

  return (
    <form
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
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end gap-2 pt-4 pb-4 border-t shrink-0 bg-background px-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!isFormValid || loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
