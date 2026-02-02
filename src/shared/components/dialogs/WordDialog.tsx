import { useState, useEffect } from "react";
import { IWord } from "@/types/models/Word";
import { WordCreate, WordUpdate } from "@/shared/hooks/useWords";
import { Difficulty, Language, WordType } from "@/types/business";
import { difficultyJson, languagesJson, wordTypesJson } from "@/data/bussiness/shared";
import { ModalNova } from "../ui/modal-nova";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, Plus, X, BookOpen, Languages, FileText, Image } from "lucide-react";
import { Badge } from "../ui/badge";
import { ImageUploaderCard } from "../ui/ImageUploaderCard";
import { wordService } from "@/services/wordService";

interface WordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word?: IWord | null;
  onSave: (wordData: WordCreate | WordUpdate) => Promise<boolean>;
}

export function WordDialog({ open, onOpenChange, word, onSave }: WordDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingWord, setLoadingWord] = useState(false);
  const [fullWord, setFullWord] = useState<IWord | null>(null);
  const [formData, setFormData] = useState({
    word: "",
    definition: "",
    language: "en" as Language,
    difficulty: "medium" as Difficulty,
    IPA: "",
    img: "",
    spanishWord: "",
    spanishDefinition: "",
    // Arrays
    type: [] as WordType[],
    examples: [] as string[],
    sinonyms: [] as string[],
    codeSwitching: [] as string[],
  });

  // Temporary inputs for arrays
  const [typeSelect, setTypeSelect] = useState<WordType | "">("");
  const [exampleInput, setExampleInput] = useState("");
  const [synonymInput, setSynonymInput] = useState("");
  const [codeSwitchingInput, setCodeSwitchingInput] = useState("");

  // Cargar palabra completa desde el servidor cuando se abre el dialog de edición
  useEffect(() => {
    if (!open) {
      setFullWord(null);
      return;
    }

    // Si hay una palabra para editar, cargar la versión completa desde el servidor
    if (word && word._id) {
      setLoadingWord(true);
      wordService.getWordById(word._id)
        .then((response) => {
          const wordData = response.data || response;
          setFullWord(wordData);
        })
        .catch((error) => {
          console.error("Error loading word:", error);
          // Si falla, usar la palabra que se pasó como prop
          setFullWord(word);
        })
        .finally(() => {
          setLoadingWord(false);
        });
    } else {
      // Si no hay palabra, es modo crear
      setFullWord(null);
    }
  }, [open, word?._id]);

  // Actualizar formData cuando fullWord cambia
  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setFormData({
        word: "",
        definition: "",
        language: "en",
        difficulty: "medium",
        IPA: "",
        img: "",
        spanishWord: "",
        spanishDefinition: "",
        type: [],
        examples: [],
        sinonyms: [],
        codeSwitching: [],
      });
      return;
    }

    if (fullWord) {
      // Asegurar que los arrays sean arrays, no undefined
      const wordType = Array.isArray(fullWord.type) ? fullWord.type : [];
      const wordExamples = Array.isArray(fullWord.examples) ? fullWord.examples : [];
      const wordSinonyms = Array.isArray(fullWord.sinonyms) ? fullWord.sinonyms : [];
      const wordCodeSwitching = Array.isArray(fullWord.codeSwitching) ? fullWord.codeSwitching : [];
      
      setFormData({
        word: fullWord.word || "",
        definition: fullWord.definition || "",
        language: (fullWord.language as Language) || "en",
        difficulty: (fullWord.difficulty as Difficulty) || "medium",
        IPA: fullWord.IPA || "",
        img: fullWord.img || "",
        spanishWord: fullWord.spanish?.word || "",
        spanishDefinition: fullWord.spanish?.definition || "",
        type: wordType as WordType[],
        examples: wordExamples,
        sinonyms: wordSinonyms,
        codeSwitching: wordCodeSwitching,
      });
    } else if (!word) {
      // Reset for new word
      setFormData({
        word: "",
        definition: "",
        language: "en",
        difficulty: "medium",
        IPA: "",
        img: "",
        spanishWord: "",
        spanishDefinition: "",
        type: [],
        examples: [],
        sinonyms: [],
        codeSwitching: [],
      });
    }
    // Clear temporary inputs
    setTypeSelect("");
    setExampleInput("");
    setSynonymInput("");
    setCodeSwitchingInput("");
  }, [fullWord, open, word]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const wordData: any = {
        word: formData.word,
        definition: formData.definition,
        language: formData.language,
        difficulty: formData.difficulty,
        IPA: formData.IPA || undefined,
        img: formData.img || undefined,
        type: formData.type.length > 0 ? formData.type : undefined,
        examples: formData.examples.length > 0 ? formData.examples : undefined,
        sinonyms: formData.sinonyms.length > 0 ? formData.sinonyms : undefined,
        codeSwitching: formData.codeSwitching.length > 0 ? formData.codeSwitching : undefined,
      };

      // Add spanish if provided
      if (formData.spanishWord || formData.spanishDefinition) {
        wordData.spanish = {
          word: formData.spanishWord || "",
          definition: formData.spanishDefinition || "",
        };
      }

      const success = await onSave(wordData);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Array management functions
  const addToArray = (field: 'type' | 'examples' | 'sinonyms' | 'codeSwitching', value: string | WordType) => {
    if (value && (typeof value === 'string' ? value.trim() : true)) {
      const valueToAdd = typeof value === 'string' ? value.trim() : value;
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], valueToAdd]
      }));
      // Clear input
      if (field === 'type') setTypeSelect("");
      if (field === 'examples') setExampleInput("");
      if (field === 'sinonyms') setSynonymInput("");
      if (field === 'codeSwitching') setCodeSwitchingInput("");
    }
  };

  const removeFromArray = (field: 'type' | 'examples' | 'sinonyms' | 'codeSwitching', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const isEditMode = !!word && !!fullWord;

  return (
    <ModalNova
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Word" : "Create New Word"}
      description={
        isEditMode
          ? "Update word information"
          : "Fill in the information to create a new word"
      }
      size="4xl"
      height="h-[90vh]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || loadingWord}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || loadingWord} onClick={handleSubmit}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEditMode ? "Update Word" : "Create Word"}
          </Button>
        </>
      }
    >
      <div className="px-6">
        {loadingWord && isEditMode ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando palabra...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="word">Word *</Label>
              <Input
                id="word"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                required
                disabled={loading || loadingWord}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="IPA">IPA (Pronunciation)</Label>
              <Input
                id="IPA"
                value={formData.IPA}
                onChange={(e) => setFormData({ ...formData, IPA: e.target.value })}
                disabled={loading || loadingWord}
                placeholder="e.g., /həˈloʊ/"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Definition */}
          <div className="space-y-2">
            <Label htmlFor="definition">Definition *</Label>
            <Textarea
              id="definition"
              value={formData.definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              required
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Language, Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select
                value={formData.language}
                onValueChange={(value: Language) => setFormData({ ...formData, language: value })}
                disabled={loading || loadingWord}
              >
                <SelectTrigger>
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
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: Difficulty) => setFormData({ ...formData, difficulty: value })}
                disabled={loading || loadingWord}
              >
                <SelectTrigger>
                  <SelectValue />
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
        </TabsContent>

        {/* Spanish Tab */}
        <TabsContent value="spanish" className="space-y-4 mt-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Traducción al español (opcional)
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="spanishWord">Spanish Word</Label>
              <Input
                id="spanishWord"
                value={formData.spanishWord}
                onChange={(e) => setFormData({ ...formData, spanishWord: e.target.value })}
                disabled={loading || loadingWord}
                autoComplete="off"
                placeholder="e.g., hola"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spanishDefinition">Spanish Definition</Label>
              <Textarea
                id="spanishDefinition"
                value={formData.spanishDefinition}
                onChange={(e) => setFormData({ ...formData, spanishDefinition: e.target.value })}
                disabled={loading || loadingWord}
                rows={4}
                placeholder="Definición en español..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4 mt-4">
          {/* Word Types */}
          <div className="space-y-2">
            <Label>Word Types</Label>
            <div className="flex gap-2">
              <Select
                value={typeSelect}
                onValueChange={(value: WordType) => setTypeSelect(value)}
                disabled={loading || loadingWord}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select word type" />
                </SelectTrigger>
                <SelectContent>
                  {wordTypesJson.map((wt) => (
                    <SelectItem key={wt.value} value={wt.value}>
                      {wt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="icon"
                onClick={() => typeSelect && addToArray('type', typeSelect)}
                disabled={loading || !typeSelect}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.type.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.type.map((t, idx) => {
                  const typeLabel = wordTypesJson.find(wt => wt.value === t)?.label || t;
                  return (
                    <Badge key={idx} variant="secondary">
                      {typeLabel}
                      <button
                        type="button"
                        onClick={() => removeFromArray('type', idx)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <Label>Examples</Label>
            <div className="flex gap-2">
              <Input
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('examples', exampleInput);
                  }
                }}
                disabled={loading || loadingWord}
                placeholder="Add example and press Enter"
                autoComplete="off"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => addToArray('examples', exampleInput)}
                disabled={loading || loadingWord}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.examples.length > 0 && (
              <div className="space-y-1 mt-2">
                {formData.examples.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                    <span className="flex-1">{ex}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray('examples', idx)}
                      className="hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Synonyms */}
          <div className="space-y-2">
            <Label>Synonyms</Label>
            <div className="flex gap-2">
              <Input
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('sinonyms', synonymInput);
                  }
                }}
                disabled={loading || loadingWord}
                placeholder="Add synonym and press Enter"
                autoComplete="off"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => addToArray('sinonyms', synonymInput)}
                disabled={loading || loadingWord}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.sinonyms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sinonyms.map((s, idx) => (
                  <Badge key={idx} variant="outline">
                    {s}
                    <button
                      type="button"
                      onClick={() => removeFromArray('sinonyms', idx)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Code Switching */}
          <div className="space-y-2">
            <Label>Code Switching Examples</Label>
            <div className="flex gap-2">
              <Input
                value={codeSwitchingInput}
                onChange={(e) => setCodeSwitchingInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('codeSwitching', codeSwitchingInput);
                  }
                }}
                disabled={loading || loadingWord}
                placeholder="Add code switching example and press Enter"
                autoComplete="off"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => addToArray('codeSwitching', codeSwitchingInput)}
                disabled={loading || loadingWord}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.codeSwitching.length > 0 && (
              <div className="space-y-1 mt-2">
                {formData.codeSwitching.map((cs, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                    <span className="flex-1">{cs}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray('codeSwitching', idx)}
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
            title="Imagen de la Palabra"
            description={
              word
                ? "Sube una nueva imagen, genera con IA, o usa una URL"
                : "Ingresa una URL de imagen. Podrás subir una imagen después de crear la palabra."
            }
            imageUrl={formData.img || ""}
            onImageChange={(url) => setFormData({ ...formData, img: url })}
            entityId={fullWord?._id || word?._id}
            entityType="word"
            word={formData.word}
            disabled={loading || loadingWord}
            className="mt-0"
          />
        </TabsContent>
      </Tabs>
          </form>
        )}
      </div>
    </ModalNova>
  );
}
