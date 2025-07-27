import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLectureStore } from "@/lib/store/useLectureStore";
import { useWordStore } from "@/lib/store/useWordStore";
import {
  Volume2,
  X,
  RotateCcw,
  FileText,
  Clock,
  Languages,
  Star,
  User,
  Eye,
  RefreshCw,
  Wand2,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/common/classnames";
import type { Lecture } from "@/models/Lecture";
import type { Word } from "@/models/Word";
import { getMarkdownTitle, convertMarkdownToHtml } from "@/utils/common/string";
import { lectureTypes } from "@/data/lectureTypes";
import { SPEECH_RATES } from "../../speechRates";
import { getLanguageInfo } from "@/utils/common/language";
import { toast } from "sonner";
import { WordDetailsModal } from "@/components/word-details";

export default function LectureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { lectures, getLectureById, loading } = useLectureStore();
  const { 
    getWordByName, 
    generateWord, 
    updateWordImage, 
    updateWordExamples, 
    updateWordSynonyms, 
    updateWordCodeSwitching, 
    updateWordTypes 
  } = useWordStore();

  const [lecture, setLecture] = useState<Lecture | null>(null);

  // Palabras seleccionadas y pronunciación
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [modalWord, setModalWord] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundWord, setFoundWord] = useState<Word | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [loadingSynonyms, setLoadingSynonyms] = useState(false);
  const [loadingCodeSwitching, setLoadingCodeSwitching] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

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
      utterance.rate = SPEECH_RATES.NORMAL;
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

  const openWordModal = async (word: string) => {
    setModalWord(word);
    setIsModalOpen(true);
    setIsSearching(true);
    setFoundWord(null);
    
    try {
      await getWordByName(word);
      // Si no hay error, la palabra existe
      const wordStore = useWordStore.getState();
      setFoundWord(wordStore.activeWord);
    } catch (error) {
      // La palabra no existe - error 404
      setFoundWord(null);
    } finally {
      setIsSearching(false);
    }
  };

  const closeWordModal = () => {
    setIsModalOpen(false);
    setModalWord(null);
    setFoundWord(null);
    setIsSearching(false);
    setIsGenerating(false);
    setLoadingImage(false);
    setLoadingExamples(false);
    setLoadingSynonyms(false);
    setLoadingCodeSwitching(false);
    setLoadingTypes(false);
  };

  const handleGenerateWord = async () => {
    if (!modalWord) return;
    
    setIsGenerating(true);
    try {
      console.log("Generando palabra:", modalWord);
      const generatedWord = await generateWord(modalWord);
      console.log("Palabra generada exitosamente:", generatedWord);
      
      // Pequeño delay para asegurar que el backend termine de procesar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Palabra generada", {
        description: `La palabra "${modalWord}" ha sido generada exitosamente`,
      });
      
      // Usar directamente la palabra generada
      setFoundWord(generatedWord);
      console.log("Estado foundWord actualizado:", generatedWord);
      
      // Verificar que el estado se actualizó correctamente
      setTimeout(() => {
        console.log("Estado foundWord después de actualizar:", foundWord);
      }, 100);
      
    } catch (error: any) {
      console.error("Error al generar palabra:", error);
      toast.error("Error al generar palabra", {
        description: error.message || "No se pudo generar la palabra",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshImage = async () => {
    if (!foundWord?._id || !modalWord) return;
    
    setLoadingImage(true);
    try {
      const updatedWord = await updateWordImage(foundWord._id, modalWord, foundWord.img);
      toast.success("Imagen actualizada", {
        description: `La imagen de "${modalWord}" ha sido regenerada`,
      });
      setFoundWord(updatedWord);
    } catch (error: any) {
      toast.error("Error al actualizar imagen", {
        description: error.message || "No se pudo actualizar la imagen",
      });
    } finally {
      setLoadingImage(false);
    }
  };

  const handleRefreshExamples = async () => {
    if (!foundWord?._id || !modalWord) return;
    
    setLoadingExamples(true);
    try {
      const updatedWord = await updateWordExamples(foundWord._id, modalWord, "en", foundWord.examples || []);
      toast.success("Ejemplos actualizados", {
        description: `Los ejemplos de "${modalWord}" han sido regenerados`,
      });
      setFoundWord(updatedWord);
    } catch (error: any) {
      toast.error("Error al actualizar ejemplos", {
        description: error.message || "No se pudo actualizar los ejemplos",
      });
    } finally {
      setLoadingExamples(false);
    }
  };

  const handleRefreshSynonyms = async () => {
    if (!foundWord?._id || !modalWord) return;
    
    setLoadingSynonyms(true);
    try {
      const updatedWord = await updateWordSynonyms(foundWord._id, modalWord, "en", foundWord.sinonyms || []);
      toast.success("Sinónimos actualizados", {
        description: `Los sinónimos de "${modalWord}" han sido regenerados`,
      });
      setFoundWord(updatedWord);
    } catch (error: any) {
      toast.error("Error al actualizar sinónimos", {
        description: error.message || "No se pudo actualizar los sinónimos",
      });
    } finally {
      setLoadingSynonyms(false);
    }
  };

  const handleRefreshCodeSwitching = async () => {
    if (!foundWord?._id || !modalWord) return;
    
    setLoadingCodeSwitching(true);
    try {
      const updatedWord = await updateWordCodeSwitching(foundWord._id, modalWord, "en", foundWord.codeSwitching || []);
      toast.success("Code-switching actualizado", {
        description: `El code-switching de "${modalWord}" ha sido regenerado`,
      });
      setFoundWord(updatedWord);
    } catch (error: any) {
      toast.error("Error al actualizar code-switching", {
        description: error.message || "No se pudo actualizar el code-switching",
      });
    } finally {
      setLoadingCodeSwitching(false);
    }
  };

  const handleRefreshTypes = async () => {
    if (!foundWord?._id || !modalWord) return;
    
    setLoadingTypes(true);
    try {
      const updatedWord = await updateWordTypes(foundWord._id, modalWord, "en", foundWord.type || []);
      toast.success("Tipos actualizados", {
        description: `Los tipos de "${modalWord}" ha sido regenerados`,
      });
      setFoundWord(updatedWord);
    } catch (error: any) {
      toast.error("Error al actualizar tipos", {
        description: error.message || "No se pudo actualizar los tipos",
      });
    } finally {
      setLoadingTypes(false);
    }
  };

  // Componentes auxiliares para el modal
  const SectionContainer = ({
    children,
    hasBox = false,
    className = "",
  }: {
    children: React.ReactNode;
    hasBox?: boolean;
    className?: string;
  }) => (
    <div
      className={cn(
        "my-4",
        hasBox && "border border-border rounded-lg p-5 relative",
        className
      )}
    >
      {children}
    </div>
  );

  const SectionHeader = ({
    title,
    onRefresh,
    loading = false,
  }: {
    title: string;
    onRefresh?: () => void;
    loading?: boolean;
  }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw
            className={cn(
              "h-4 w-4",
              loading && "animate-spin text-muted-foreground"
            )}
          />
        </Button>
      )}
    </div>
  );

  const speakWordModal = (rate = SPEECH_RATES.NORMAL, language = "en-US") => {
    if (!modalWord) return;
    const utterance = new SpeechSynthesisUtterance(modalWord);
    utterance.rate = rate;
    utterance.lang = language;
    speechSynthesis.speak(utterance);
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
              <AvatarImage
                src={lecture.img || "/images/noImage.png"}
                alt={title}
              />
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
                <span>{getLanguageInfo(lecture.language).flag} {getLanguageInfo(lecture.language).name}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la lectura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
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
        <Card className="sticky bottom-0 z-50 rounded-t-lg border-t shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                  className="flex items-center gap-1 px-2 py-1"
                >
                  <span className="font-medium">{word}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-primary/20"
                    onClick={() => openWordModal(word)}
                    title="Ver detalles"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-primary/20"
                    onClick={() => speakWord(word)}
                    disabled={isPlaying && currentWord === word}
                    title="Reproducir audio"
                  >
                    <Volume2
                      className={cn(
                        "h-3 w-3",
                        isPlaying && currentWord === word && "animate-pulse"
                      )}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive/20"
                    onClick={() => removeSelectedWord(word)}
                    title="Eliminar palabra"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para detalles de palabra */}
      {foundWord && (
        <WordDetailsModal
          word={foundWord}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          showLevelButtons={true}
          showRefreshButtons={true}
        />
      )}

      {/* Modal para palabra no encontrada */}
      {isModalOpen && !foundWord && !isSearching && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md border border-gray-600 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Palabra no encontrada
              </DialogTitle>
            </DialogHeader>
            
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                La palabra "{modalWord}" no existe en la base de datos.
              </p>
              <Button
                onClick={handleGenerateWord}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando palabra...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generar palabra
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={closeWordModal}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Loading state */}
      {isModalOpen && isSearching && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md border border-gray-600 shadow-2xl">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Buscando palabra...</span>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
