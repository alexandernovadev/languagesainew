import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Word } from "@/models/Word";
import { wordLevels } from "@/data/wordLevels";
import { EditableList } from "./EditableList";
import { Languages, Book, Type, Star, Sparkles, ListPlus } from "lucide-react";

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
  const [formData, setFormData] = useState<Partial<Word>>({
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
  });

  useEffect(() => {
    // Ensure arrays are not undefined when resetting form
    const dataWithArrays = {
      ...initialData,
      examples: initialData.examples || [],
      sinonyms: initialData.sinonyms || [],
      codeSwitching: initialData.codeSwitching || [],
    };
    setFormData(dataWithArrays);
  }, [initialData]);

  const isFormValid = formData.word && formData.spanish?.word;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof Word, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpanishChange = (
    field: "word" | "definition",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      spanish: { ...prev.spanish, [field]: value } as any,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-grow min-h-0"
    >
      <div className="flex-grow overflow-y-auto px-1">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sticky top-0 bg-background z-10">
            <TabsTrigger value="basic">
              <Book className="h-4 w-4 mr-2" />
              Información Básica
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Sparkles className="h-4 w-4 mr-2" />
              Campos Avanzados
            </TabsTrigger>
          </TabsList>

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
                      value={formData.word || ""}
                      onChange={(e) => handleChange("word", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spanish-word">Traducción (Español)</Label>
                    <Input
                      id="spanish-word"
                      value={formData.spanish?.word || ""}
                      onChange={(e) => handleSpanishChange("word", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="definition">Definición (Inglés)</Label>
                  <Textarea
                    id="definition"
                    value={formData.definition || ""}
                    onChange={(e) => handleChange("definition", e.target.value)}
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
                    <Input
                      id="ipa"
                      value={formData.IPA || ""}
                      onChange={(e) => handleChange("IPA", e.target.value)}
                    />
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
                  <CardTitle className="flex items-center gap-2"><ListPlus className="h-5 w-5"/> Sinónimos</CardTitle>
                 <CardDescription>Palabras con significado similar.</CardDescription>
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
                  <CardTitle className="flex items-center gap-2"><ListPlus className="h-5 w-5"/> Ejemplos de Uso</CardTitle>
                 <CardDescription>Palabras que se utilizan para ilustrar el uso de la palabra.</CardDescription>
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
                  <CardTitle className="flex items-center gap-2"><ListPlus className="h-5 w-5"/> Code Switching</CardTitle>
                 <CardDescription>Palabras que se utilizan para ilustrar el uso de code switching.</CardDescription>
               </CardHeader>
               <CardContent>
                 <EditableList
                   items={formData.codeSwitching || []}
                   onChange={(items) => handleChange("codeSwitching", items)}
                   placeholder="Añadir ejemplo de code switching..."
                 />
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t shrink-0 bg-background">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!isFormValid || loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
} 