import { useState, useEffect } from "react";
import { ModalNova } from "../ui/modal-nova";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, Plus, X, BookOpen, Languages, FileText, Image } from "lucide-react";
import { IExpression } from "@/types/models/Expression";
import { ExpressionType } from "@/types/business";
import { difficultyJson, languagesJson, expressionTypesJson } from "@/data/bussiness/shared";
import { ImageUploaderCard } from "../ui/ImageUploaderCard";

interface ExpressionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expression: IExpression | null;
  onSave: (data: any) => Promise<boolean>;
}

export function ExpressionDialog({ open, onOpenChange, expression, onSave }: ExpressionDialogProps) {
  const isEditMode = !!expression;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    expression: "",
    definition: "",
    language: "en",
    difficulty: "",
    type: [] as ExpressionType[],
    context: "",
    examples: [] as string[],
    img: "",
    spanish: {
      expression: "",
      definition: "",
    },
  });

  // Temporary inputs for arrays
  const [currentExample, setCurrentExample] = useState("");
  const [currentTypeInput, setCurrentTypeInput] = useState("");

  // Reset form when dialog opens with expression data
  useEffect(() => {
    // SOLO actuar cuando el diálogo está abierto
    if (!open) return;
    
    if (expression) {
      setFormData({
        expression: expression.expression || "",
        definition: expression.definition || "",
        language: expression.language || "en",
        difficulty: expression.difficulty || "",
        type: (expression.type as ExpressionType[]) || [],
        context: expression.context || "",
        examples: expression.examples || [],
        img: expression.img || "",
        spanish: {
          expression: expression.spanish?.expression || "",
          definition: expression.spanish?.definition || "",
        },
      });
    } else {
      // Reset for new expression
      setFormData({
        expression: "",
        definition: "",
        language: "en",
        difficulty: "",
        type: [],
        context: "",
        examples: [],
        img: "",
        spanish: {
          expression: "",
          definition: "",
        },
      });
    }
    setCurrentExample("");
    setCurrentTypeInput("");
  }, [expression, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await onSave(formData);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle adding example
  const handleAddExample = () => {
    if (currentExample.trim()) {
      setFormData({
        ...formData,
        examples: [...formData.examples, currentExample.trim()],
      });
      setCurrentExample("");
    }
  };

  // Handle removing example
  const handleRemoveExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index),
    });
  };

  // Handle adding type
  const handleAddType = () => {
    if (currentTypeInput && !formData.type.includes(currentTypeInput as ExpressionType)) {
      setFormData({
        ...formData,
        type: [...formData.type, currentTypeInput as ExpressionType],
      });
      setCurrentTypeInput("");
    }
  };

  // Handle removing type
  const handleRemoveType = (type: ExpressionType) => {
    setFormData({
      ...formData,
      type: formData.type.filter((t) => t !== type),
    });
  };

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Expression" : "Create New Expression"}
      description={
        isEditMode
          ? "Update expression information."
          : "Fill in the information to create a new expression."
      }
      size="3xl"
      height="h-[90vh]"
      footer={
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" form="expression-form" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEditMode ? "Update Expression" : "Create Expression"}
          </Button>
        </div>
      }
    >
      <form id="expression-form" onSubmit={handleSubmit} className="px-6 py-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="sticky top-0 z-10 grid w-full grid-cols-4 shadow-md">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="spanish" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Español</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Contenido</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Imagen</span>
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="expression">Expression *</Label>
              <Input
                id="expression"
                value={formData.expression}
                onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
                required
                disabled={loading}
                placeholder="e.g., break the ice"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="definition">Definition *</Label>
              <Textarea
                id="definition"
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                required
                disabled={loading}
                placeholder="Enter expression definition..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languagesJson.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyJson.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Types */}
            <div className="space-y-2">
              <Label htmlFor="type">Types</Label>
              <div className="flex gap-2">
                <Select
                  value={currentTypeInput}
                  onValueChange={setCurrentTypeInput}
                  disabled={loading}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expressionTypesJson.map((typeOption) => (
                      <SelectItem key={typeOption.value} value={typeOption.value}>
                        {typeOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddType}
                  disabled={loading || !currentTypeInput}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.type.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.type.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      <span>{type}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveType(type)}
                        disabled={loading}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Spanish Tab */}
          <TabsContent value="spanish" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="spanishExpression">Spanish Expression</Label>
              <Input
                id="spanishExpression"
                value={formData.spanish.expression}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    spanish: { ...formData.spanish, expression: e.target.value },
                  })
                }
                disabled={loading}
                placeholder="Traducción de la expresión"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spanishDefinition">Spanish Definition</Label>
              <Textarea
                id="spanishDefinition"
                value={formData.spanish.definition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    spanish: { ...formData.spanish, definition: e.target.value },
                  })
                }
                disabled={loading}
                placeholder="Definición en español..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="context">Context</Label>
              <Textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                disabled={loading}
                placeholder="Context where this expression is used..."
                rows={3}
              />
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <Label htmlFor="example">Examples</Label>
              <div className="flex gap-2">
                <Input
                  id="example"
                  value={currentExample}
                  onChange={(e) => setCurrentExample(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddExample();
                    }
                  }}
                  disabled={loading}
                  placeholder="Add an example..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddExample}
                  disabled={loading || !currentExample.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.examples.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.examples.map((example, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-secondary p-2 rounded-md"
                    >
                      <span className="flex-1 text-sm">{example}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExample(index)}
                        disabled={loading}
                        className="hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="mt-4">
            <ImageUploaderCard
              title="Imagen de la Expresión"
              description={
                isEditMode
                  ? "Sube una nueva imagen, genera con IA, o usa una URL"
                  : "Ingresa una URL de imagen. Podrás subir una imagen después de crear la expresión."
              }
              imageUrl={formData.img || ""}
              onImageChange={(url) => setFormData({ ...formData, img: url })}
              entityId={expression?._id}
              entityType="expression"
              word={formData.expression}
              disabled={loading}
              className="mt-0"
            />
          </TabsContent>
        </Tabs>
      </form>
    </ModalNova>
  );
}
