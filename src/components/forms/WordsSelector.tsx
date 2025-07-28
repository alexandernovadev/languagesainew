import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Check, X, BookOpen, Info, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { wordService } from "@/services/wordService";
import { WORD_TYPES } from "@/utils/constants/wordTypes";

interface Word {
  word: string;
}

interface WordsSelectorProps {
  selectedWords: string[];
  onWordsChange: (words: string[]) => void;
  error?: string;
  preloadedWords?: Record<string, { word: string }[]>;
}

export function WordsSelector({
  selectedWords,
  onWordsChange,
  error,
  preloadedWords,
}: WordsSelectorProps) {
  const [wordsByType, setWordsByType] = useState<Record<string, Word[]>>({});
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [expandedTypes, setExpandedTypes] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState<Record<string, boolean>>({});
  const [isShaking, setIsShaking] = useState(false);

  const handleWordToggle = (word: string) => {
    const newWords = selectedWords.includes(word)
      ? selectedWords.filter((w) => w !== word)
      : [...selectedWords, word];

    onWordsChange(newWords);
  };

  const handleSelectRandom = () => {
    setIsShaking(true);

    const allWords = Object.values(wordsByType)
      .flat()
      .map((w) => w.word);

    if (allWords.length === 0) {
      setIsShaking(false);
      return;
    }

    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const randomWords = shuffled.slice(0, Math.min(8, allWords.length));

    onWordsChange(randomWords);

    setTimeout(() => {
      setIsShaking(false);
    }, 200);
  };

  const handleClearAll = () => {
    onWordsChange([]);
  };

  const handleSelectType = (typeKey: string) => {
    const typeWords = wordsByType[typeKey] || [];
    const currentTypeWords = selectedWords.filter((word) =>
      typeWords.some((w) => w.word === word)
    );

    const newWords =
      currentTypeWords.length === typeWords.length
        ? selectedWords.filter(
            (word) => !typeWords.some((w) => w.word === word)
          )
        : [
            ...selectedWords.filter(
              (word) => !typeWords.some((w) => w.word === word)
            ),
            ...typeWords.map((w) => w.word),
          ];

    onWordsChange(newWords);
  };

  const isTypeSelected = (typeKey: string) => {
    const typeWords = wordsByType[typeKey] || [];
    const selectedTypeWords = selectedWords.filter((word) =>
      typeWords.some((w) => w.word === word)
    );

    return (
      selectedTypeWords.length === typeWords.length && typeWords.length > 0
    );
  };

  const isTypePartiallySelected = (typeKey: string) => {
    const typeWords = wordsByType[typeKey] || [];
    const selectedTypeWords = selectedWords.filter((word) =>
      typeWords.some((w) => w.word === word)
    );

    return (
      selectedTypeWords.length > 0 &&
      selectedTypeWords.length < typeWords.length
    );
  };

  const loadWordsByType = async (typeKey: string) => {
    if (loadingTypes[typeKey] || wordsByType[typeKey]) return;

    setLoadingTypes((prev) => ({ ...prev, [typeKey]: true }));

    try {
      const searchTerm = searchTerms[typeKey] || "";

      // Usar el servicio optimizado que solo trae la palabra
      const words = await wordService.getWordsByTypeOptimized(
        typeKey,
        10,
        searchTerm
      );

      setWordsByType((prev) => ({ ...prev, [typeKey]: words }));
    } catch (error) {
      console.error(`Error loading ${typeKey} words:`, error);
      // No mostrar mock data, solo dejar vacío
      setWordsByType((prev) => ({ ...prev, [typeKey]: [] }));
    } finally {
      setLoadingTypes((prev) => ({ ...prev, [typeKey]: false }));
    }
  };

  const handleTypeExpand = (typeKey: string) => {
    // Solo cargar si no hay palabras precargadas y no tenemos palabras para este tipo
    if (
      !preloadedWords &&
      (!wordsByType[typeKey] || wordsByType[typeKey].length === 0)
    ) {
      loadWordsByType(typeKey);
    }
  };

  const filteredWordsByType = (typeKey: string) => {
    const words = wordsByType[typeKey] || [];
    const searchTerm = searchTerms[typeKey] || "";

    if (!searchTerm) return words;

    return words.filter(
      (word) =>
        word &&
        word.word &&
        word.word.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Usar palabras precargadas si están disponibles, sino cargar bajo demanda
  useEffect(() => {
    if (preloadedWords && Object.keys(preloadedWords).length > 0) {
      setWordsByType(preloadedWords);
    } else {
      // Solo cargar si no hay palabras precargadas
      WORD_TYPES.forEach((type) => {
        loadWordsByType(type.key);
      });
    }
  }, [preloadedWords]);

  // Recargar palabras cuando cambie el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Object.keys(searchTerms).forEach((typeKey) => {
        if (searchTerms[typeKey]) {
          // Limpiar palabras existentes para forzar recarga
          setWordsByType((prev) => ({ ...prev, [typeKey]: [] }));
          loadWordsByType(typeKey);
        }
      });
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerms]);

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectRandom}
            className={`text-xs transition-all duration-200 ${
              isShaking ? "animate-shake" : ""
            }`}
          >
            <Check className="h-3 w-3 mr-1" />
            Seleccionar 8 Aleatorias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        </div>

        {/* Selected count */}
        {selectedWords.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className={`cursor-help transition-all duration-200 ${
                      isShaking ? "animate-shake" : ""
                    }`}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    {selectedWords.length} palabra
                    {selectedWords.length !== 1 ? "s" : ""} seleccionada
                    {selectedWords.length !== 1 ? "s" : ""}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">Mis palabras seleccionadas:</p>
                    <div className="space-y-1">
                      {selectedWords.map((word, index) => (
                        <div key={index} className="text-xs">
                          • {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Error display */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        <Separator />

        {/* Word Types */}
        <div className="border rounded-lg">
          <div className="p-4">
              <Accordion
                type="multiple"
                value={expandedTypes}
                onValueChange={setExpandedTypes}
                className="space-y-2"
              >
                {WORD_TYPES.map((type) => {
                  const typeKey = type.key;
                  const typeWords = wordsByType[typeKey] || [];
                  const selectedTypeWords = selectedWords.filter((word) =>
                    typeWords.some((w) => w.word === word)
                  );
                  const filteredWords = filteredWordsByType(typeKey);
                  const isLoading = loadingTypes[typeKey];

                  const isSelected = isTypeSelected(typeKey);
                  const isPartiallySelected = isTypePartiallySelected(typeKey);

                  return (
                    <AccordionItem
                      key={typeKey}
                      value={typeKey}
                      className="border rounded-md bg-background"
                    >
                      <div className="flex items-center px-3 py-2 bg-muted/30 rounded-t-md">
                        <Checkbox
                          checked={isSelected || isPartiallySelected}
                          onCheckedChange={() => handleSelectType(typeKey)}
                          className="mr-3"
                          disabled={isLoading}
                        />
                        <AccordionTrigger
                          className="flex-1 hover:no-underline py-1"
                          onClick={() => handleTypeExpand(typeKey)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-base">{type.icon}</span>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">
                                {type.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {isLoading
                                  ? "Cargando..."
                                  : `${selectedTypeWords.length} de ${typeWords.length} seleccionadas`}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="px-3 pb-3">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm">
                              Cargando palabras...
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2 mt-2">
                            {/* Search for this type */}
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                              <Input
                                placeholder={`Buscar ${type.label.toLowerCase()}...`}
                                value={searchTerms[typeKey] || ""}
                                onChange={(e) =>
                                  setSearchTerms((prev) => ({
                                    ...prev,
                                    [typeKey]: e.target.value,
                                  }))
                                }
                                className="pl-8 h-8 text-xs"
                              />
                            </div>

                            {/* Words list */}
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {filteredWords.map((word, index) => (
                                <label
                                  key={`${word.word}-${index}`}
                                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                  <Checkbox
                                    checked={selectedWords.includes(word.word)}
                                    onCheckedChange={() =>
                                      handleWordToggle(word.word)
                                    }
                                    aria-label={`Select word: ${word.word}`}
                                  />
                                  <div className="flex-1">
                                    <span className="text-sm font-medium">
                                      {word.word}
                                    </span>
                                  </div>
                                </label>
                              ))}

                              {filteredWords.length === 0 && (
                                <div className="text-center py-4 text-xs text-muted-foreground">
                                  {typeWords.length === 0 ? (
                                    <div className="space-y-2">
                                      <p>
                                        No tienes palabras de este tipo en tu
                                        biblioteca.
                                      </p>
                                      <p className="text-xs">
                                        Agrega palabras desde "Mis Palabras"
                                        primero.
                                      </p>
                                    </div>
                                  ) : (
                                    "No se encontraron palabras con esa búsqueda"
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
