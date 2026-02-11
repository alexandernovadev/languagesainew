import { useState, useEffect, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { X, Search, BookOpen } from "lucide-react";
import { wordService } from "@/services/wordService";
import { IWord } from "@/types/models/Word";
import { cn } from "@/utils/common/classnames";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface WordSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  language?: string;
  maxSelections?: number;
}

interface WordGroup {
  words: IWord[];
  loading: boolean;
}

export function WordSelector({
  selected,
  onChange,
  language,
  maxSelections = 10,
}: WordSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IWord[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Estados para las listas por dificultad
  const [easyWords, setEasyWords] = useState<WordGroup>({ words: [], loading: true });
  const [mediumWords, setMediumWords] = useState<WordGroup>({ words: [], loading: true });
  const [hardWords, setHardWords] = useState<WordGroup>({ words: [], loading: true });

  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Cargar palabras por dificultad al montar o cuando cambia el idioma
  useEffect(() => {
    const loadWordsByDifficulty = async () => {
      const loadWords = async (difficulty: "easy" | "medium" | "hard") => {
        try {
          const response = await wordService.getWords(1, 11, {
            difficulty,
            language: language,
            sortBy: "createdAt",
            sortOrder: "desc",
          });

          const words = response.data?.data || [];
          return { words, loading: false };
        } catch (error) {
          console.error(`Error loading ${difficulty} words:`, error);
          return { words: [], loading: false };
        }
      };

      // Cargar las 3 listas en paralelo
      setEasyWords({ words: [], loading: true });
      setMediumWords({ words: [], loading: true });
      setHardWords({ words: [], loading: true });

      const [easy, medium, hard] = await Promise.all([
        loadWords("easy"),
        loadWords("medium"),
        loadWords("hard"),
      ]);

      setEasyWords(easy);
      setMediumWords(medium);
      setHardWords(hard);
    };

    loadWordsByDifficulty();
  }, [language]);

  // Buscar palabras cuando el usuario escribe
  useEffect(() => {
    const searchWords = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await wordService.getWords(1, 10, {
          wordUser: searchQuery.trim(),
          language: language,
        });

        const words = response.data?.data || [];
        setSearchResults(words);
        setShowSearchResults(words.length > 0);
      } catch (error) {
        console.error("Error searching words:", error);
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(searchWords, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery, language]);

  // Cerrar resultados de búsqueda al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddWord = (word: string) => {
    if (selected.includes(word)) return;
    if (selected.length >= maxSelections) {
      toast.error(`Máximo ${maxSelections} palabras permitidas`);
      return;
    }
    onChange([...selected, word]);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleRemoveWord = (word: string) => {
    onChange(selected.filter((w) => w !== word));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      e.preventDefault();
      handleAddWord(searchQuery.trim());
    } else if (e.key === "Escape") {
      setShowSearchResults(false);
    }
  };

  const renderWordButton = (word: IWord) => {
    const isSelected = selected.includes(word.word);
    
    return (
      <button
        key={word._id}
        type="button"
        onClick={() => !isSelected && handleAddWord(word.word)}
        disabled={isSelected || selected.length >= maxSelections}
        className={cn(
          "px-3 py-1.5 rounded-md text-sm border transition-colors",
          isSelected
            ? "bg-primary/20 text-primary border-primary/30 cursor-not-allowed"
            : selected.length >= maxSelections
            ? "opacity-50 cursor-not-allowed"
            : "bg-muted hover:bg-primary/10 hover:border-primary/50 cursor-pointer"
        )}
        title={isSelected ? "Ya seleccionada" : word.definition || word.word}
      >
        {word.word}
      </button>
    );
  };

  const renderWordGroup = (
    title: string,
    words: IWord[],
    loading: boolean,
    icon?: React.ReactNode
  ) => {
    if (loading) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {icon}
            <Label className="text-sm font-medium">{title}</Label>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando...</span>
          </div>
        </div>
      );
    }

    if (words.length === 0) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {icon}
            <Label className="text-sm font-medium">{title}</Label>
          </div>
          <p className="text-xs text-muted-foreground">No hay palabras disponibles</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <Label className="text-sm font-medium">{title}</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {words.map(renderWordButton)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Palabras Seleccionadas</Label>
        <span className="text-xs text-muted-foreground">
          {selected.length}/{maxSelections}
        </span>
      </div>

      {/* Chips de palabras seleccionadas */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md">
          {selected.map((word) => (
            <div
              key={word}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm border border-green-500"
            >
              <span>{word}</span>
              <button
                type="button"
                onClick={() => handleRemoveWord(word)}
                className="hover:bg-primary/20 rounded p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Últimas 5 Fáciles */}
      {renderWordGroup(
        "Últimas 11 Fáciles",
        easyWords.words.filter((w) => !selected.includes(w.word)),
        easyWords.loading,
        <BookOpen className="h-4 w-4 text-green-500" />
      )}

      {/* Últimas 5 Medias */}
      {renderWordGroup(
        "Últimas 11 Medias",
        mediumWords.words.filter((w) => !selected.includes(w.word)),
        mediumWords.loading,
        <BookOpen className="h-4 w-4 text-yellow-500" />
      )}

      {/* Últimas 5 Difíciles */}
      {renderWordGroup(
        "Últimas 11 Difíciles",
        hardWords.words.filter((w) => !selected.includes(w.word)),
        hardWords.loading,
        <BookOpen className="h-4 w-4 text-red-500" />
      )}

      {/* Buscador */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Buscar en Diccionario</Label>
        </div>
        
        <div className="relative">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchResults.length > 0) setShowSearchResults(true);
            }}
            placeholder="Escribe para buscar palabras... (mín. 2 caracteres)"
            disabled={selected.length >= maxSelections}
          />

          {/* Resultados de búsqueda */}
          {showSearchResults && searchResults.length > 0 && (
            <div
              ref={searchResultsRef}
              className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-[200px] overflow-y-auto"
            >
              {searchLoading && (
                <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Buscando...</span>
                </div>
              )}
              {searchResults
                .filter((word) => !selected.includes(word.word))
                .map((word) => (
                <button
                  key={word._id}
                  type="button"
                  onClick={() => handleAddWord(word.word)}
                  className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm border-b last:border-b-0"
                >
                  <div className="font-medium">{word.word}</div>
                  {word.definition && (
                    <div className="text-xs text-muted-foreground">
                      {word.definition}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Mensaje cuando no hay resultados */}
          {showSearchResults && !searchLoading && searchResults.length === 0 && searchQuery.length >= 2 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg p-2 text-sm text-muted-foreground">
              No se encontraron palabras. Presiona Enter para agregar "{searchQuery}" directamente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
