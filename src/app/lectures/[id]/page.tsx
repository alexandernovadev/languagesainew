import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLectureStore } from "@/lib/store/useLectureStore";
import {
  ArrowLeft,
  Volume2,
  X,
  RotateCcw,
  PlayCircle,
  FileText,
  Clock,
  Languages,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lecture } from "@/models/Lecture";
import { getMarkdownTitle } from "@/lib/utils";
import { lectureTypes } from "@/data/lectureTypes";

export default function LectureDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { lectures, getLectureById, loading } = useLectureStore();

  const [lecture, setLecture] = useState<Lecture | null>(null);

  // Palabras seleccionadas y pronunciación
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getLectureById(id);
    }
  }, [id, getLectureById]);

  useEffect(() => {
    if (id) {
      const foundLecture = lectures.find((l) => l._id === id);
      setLecture(foundLecture || null);
    }
  }, [id, lectures]);

  const speakWord = (word: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      setCurrentWord(word);

      const utterance = new window.SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentWord(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,!?;:"()]/g, "").toLowerCase();
    if (cleanWord.length > 2 && !selectedWords.includes(cleanWord)) {
      setSelectedWords((prev) => [...prev, cleanWord]);
      speakWord(cleanWord);
    }
  };

  const removeSelectedWord = (word: string) => {
    setSelectedWords((prev) => prev.filter((w) => w !== word));
  };

  const clearSelectedWords = () => {
    setSelectedWords([]);
  };

  // Función para convertir Markdown básico a HTML
  const convertMarkdownToHtml = (text: string) => {
    return (
      text
        // Títulos
        .replace(
          /^### (.*$)/gim,
          '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>'
        )
        .replace(
          /^# (.*$)/gim,
          '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>'
        )
        // Negritas
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
        // Cursivas
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Listas
        .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
        // Párrafos
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/^(?!<[h|li])(.*$)/gim, '<p class="mb-4">$1</p>')
        // Limpiar párrafos vacíos
        .replace(/<p class="mb-4"><\/p>/g, "")
        .replace(/<p class="mb-4"><\/p>/g, "")
    );
  };

  const renderInteractiveText = (text: string) => {
    // Primero convertimos el Markdown a HTML
    const htmlContent = convertMarkdownToHtml(text);

    // Parseamos el HTML para crear elementos React interactivos
    const parseHtmlToReact = (html: string) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const processNode = (node: Node): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          const words = text.split(" ");

          return words.map((word, index) => {
            const cleanWord = word.replace(/[.,!?;:"()]/g, "").toLowerCase();
            const isSelected = selectedWords.includes(cleanWord);
            const isCurrentlyPlaying = currentWord === cleanWord && isPlaying;

            return (
              <span
                key={`${index}-${word}`}
                className={cn(
                  "cursor-pointer hover:bg-primary/20 rounded px-1 transition-colors",
                  isSelected && "bg-primary/30 text-primary-foreground",
                  isCurrentlyPlaying && "bg-yellow-400/50 animate-pulse"
                )}
                onClick={() => handleWordClick(word)}
              >
                {word}
                {index < words.length - 1 ? " " : ""}
              </span>
            );
          });
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const tagName = element.tagName.toLowerCase();
          const children = Array.from(element.childNodes).map(processNode);

          const className = element.className || "";

          switch (tagName) {
            case "h1":
              return (
                <h1 key={Math.random()} className={className}>
                  {children}
                </h1>
              );
            case "h2":
              return (
                <h2 key={Math.random()} className={className}>
                  {children}
                </h2>
              );
            case "h3":
              return (
                <h3 key={Math.random()} className={className}>
                  {children}
                </h3>
              );
            case "p":
              return (
                <p key={Math.random()} className={className}>
                  {children}
                </p>
              );
            case "strong":
              return (
                <strong key={Math.random()} className={className}>
                  {children}
                </strong>
              );
            case "em":
              return (
                <em key={Math.random()} className={className}>
                  {children}
                </em>
              );
            case "li":
              return (
                <li key={Math.random()} className={className}>
                  {children}
                </li>
              );
            default:
              return <span key={Math.random()}>{children}</span>;
          }
        }

        return null;
      };

      return Array.from(tempDiv.childNodes).map(processNode);
    };

    return <div>{parseHtmlToReact(htmlContent)}</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando lectura...</p>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Lectura no encontrada</p>
      </div>
    );
  }

  const words = lecture.content.split(/\s+/);

  const title = getMarkdownTitle(lecture.content) || "Detalle de la Lectura";
  const typeLabel =
    lectureTypes.find((type) => type.value === lecture.typeWrite)?.label ||
    lecture.typeWrite;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Avatar className="h-40 w-40 border-2 border-primary/50">
              <AvatarImage src={lecture.img} alt={title} />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground text-sm flex-wrap">
            <div className="flex items-center gap-2"></div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 flex items-center gap-1.5 py-1 px-3 text-xs"
              >
                <Star className="h-3.5 w-3.5" />
                <span>{lecture.level}</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-400/10 flex items-center gap-1.5 py-1 px-3 text-xs"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{typeLabel}</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400/10 flex items-center gap-1.5 py-1 px-3 text-xs"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{lecture.time} min</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400/10 flex items-center gap-1.5 py-1 px-3 text-xs"
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{lecture.language.toUpperCase()}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la lectura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contenido de la Lectura</span>
            <Badge variant="secondary">
              Haz clic en las palabras para escucharlas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderInteractiveText(lecture.content)}
          </div>
        </CardContent>
      </Card>

      {/* Panel de palabras seleccionadas */}
      {selectedWords.length > 0 && (
        <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg border-t shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Palabras Seleccionadas ({selectedWords.length})</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelectedWords}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedWords.map((word, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  <span onClick={() => speakWord(word)}>{word}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-destructive/20"
                    onClick={() => removeSelectedWord(word)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => speakWord(word)}
                    disabled={isPlaying && currentWord === word}
                  >
                    <Volume2
                      className={cn(
                        "h-3 w-3",
                        isPlaying && currentWord === word && "animate-pulse"
                      )}
                    />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Espaciado para el panel fijo */}
      {selectedWords.length > 0 && <div className="h-32" />}
    </div>
  );
}
