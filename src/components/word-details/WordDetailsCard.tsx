import { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Volume2, X } from "lucide-react";
import { Word } from "@/models/Word";
import { cn } from "@/utils/common/classnames";
import { WordLevelBadge } from "@/components/WordLevelBadge";
import { SPEECH_RATES } from "../../speechRates";
import { formatDateShort } from "@/utils/common/time";
import { useWordStore } from "@/lib/store/useWordStore";
import { toast } from "sonner";
import { useResultHandler } from "@/hooks/useResultHandler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordChatTab } from "./WordChatTab";
import { useTextSelection } from "@/hooks/useTextSelection";
import { TextSelectionMenu } from "@/components/common/TextSelectionMenu";

import { LevelButtons } from "@/components/common/LevelButtons";
import { capitalize } from "@/utils";

interface WordDetailsCardProps {
  word: Word;
  variant?: "full" | "compact" | "modal";
  showLevelButtons?: boolean;
  showRefreshButtons?: boolean;
  showAudioButtons?: boolean;
}

// Componente memoizado para SectionContainer
const SectionContainer = memo(({
  children,
  className = "",
  loading = false,
}: {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}) => (
  <div className="mb-4">
    {loading ? (
      <div className="relative p-[2px] rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-green-500 animate-gradient-x">
        <div className="bg-zinc-900/90 rounded-lg p-4">{children}</div>
      </div>
    ) : (
      <div
        className={cn(
          "p-4 rounded-lg border bg-zinc-900/40 border-zinc-800",
          className
        )}
      >
        {children}
      </div>
    )}
  </div>
));

SectionContainer.displayName = "SectionContainer";

// Componente memoizado para SectionHeader
const SectionHeader = memo(({
  title,
  onRefresh,
  loading = false,
  icon,
  showRefreshButtons = true,
}: {
  title: string;
  onRefresh?: () => void;
  loading?: boolean;
  icon?: string;
  showRefreshButtons?: boolean;
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      {icon && <span className="text-lg">{icon}</span>}
      <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
        {title}
      </h3>
    </div>
    {onRefresh && showRefreshButtons && (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRefresh();
        }}
        disabled={loading}
        className={cn(
          "h-6 w-6 p-0 transition-all duration-300",
          loading
            ? "bg-zinc-800/80 border border-green-400/40"
            : "bg-zinc-800/50 hover:bg-zinc-700/50"
        )}
      >
        <RefreshCw
          className={cn(
            "h-3 w-3 transition-all duration-300",
            loading ? "animate-spin text-green-400" : "text-zinc-400"
          )}
        />
      </Button>
    )}
  </div>
));

SectionHeader.displayName = "SectionHeader";

// Componente memoizado para SelectableTextContainer
const SelectableTextContainer = memo(({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div ref={containerRef} className="relative text-selectable">
    {children}
  </div>
));

SelectableTextContainer.displayName = "SelectableTextContainer";



// Componente memoizado para AudioButtons
const AudioButtons = memo(({
  onSpeak,
  onSpeakSlow,
  isPlaying,
}: {
  onSpeak: () => void;
  onSpeakSlow: () => void;
  isPlaying: boolean;
}) => (
  <div className="flex items-center gap-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={onSpeak}
      disabled={isPlaying}
      className="h-7 w-7 p-0 bg-zinc-800/50 hover:bg-zinc-700/50"
    >
      <Volume2
        className={cn("h-3 w-3", isPlaying && "animate-pulse")}
      />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={onSpeakSlow}
      disabled={isPlaying}
      className="h-7 w-7 p-0 bg-zinc-800/50 hover:bg-zinc-700/50"
    >
      🐢
    </Button>
  </div>
));

AudioButtons.displayName = "AudioButtons";

export const WordDetailsCard = memo(function WordDetailsCard({
  word,
  variant = "full",
  showLevelButtons = true,
  showRefreshButtons = true,
  showAudioButtons = true,
}: WordDetailsCardProps) {
  const {
    updateWordLevel,
    updateWordImage,
    updateWordExamples,
    updateWordSynonyms,
    updateWordCodeSwitching,
    updateWordTypes,
    incrementWordSeen,
    actionLoading,
  } = useWordStore();

  // Hook para manejo de errores
  const { handleApiResult } = useResultHandler();

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "chat">("info");

  // Ref para la sección de ejemplos
  const examplesRef = useRef<HTMLDivElement>(null);

  // Hook para selección de texto en ejemplos
  const { selectedText, menuPosition, showMenu, clearSelection } = useTextSelection({
    containerRef: examplesRef,
    onTextSelected: (text) => {
      console.log('Texto seleccionado en ejemplos:', text);
    }
  });


  // Incrementar seen cuando se ve la palabra
  useEffect(() => {
    if (word._id) {
      incrementWordSeen(word._id);
    }
  }, [word._id, incrementWordSeen]);

  // Memoizar funciones de manejo de eventos
  const speakWord = useCallback((rate = SPEECH_RATES.NORMAL, language = "en-US") => {
    if (isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.rate = rate;
    utterance.lang = language;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  }, [word.word, isPlaying]);

  const handleSpeakNormal = useCallback(() => speakWord(), [speakWord]);
  const handleSpeakSlow = useCallback(() => speakWord(SPEECH_RATES.SUPERSLOW), [speakWord]);

  const handleUpdateLevel = useCallback(async (level: "easy" | "medium" | "hard") => {
    if (!word._id) return;

    try {
      await updateWordLevel(word._id, level);
      toast.success(`Nivel actualizado a ${level}`, {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { level }, message: `Nivel actualizado a ${level}` }, "Actualizar Nivel")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Nivel");
    }
  }, [word._id, updateWordLevel, handleApiResult]);

  const handleRefreshImage = useCallback(async () => {
    if (!word._id) return;

    try {
      await updateWordImage(word._id, word.word, word.img || "");
      toast.success("Imagen actualizada", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { word: word.word }, message: "Imagen actualizada" }, "Actualizar Imagen")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Imagen");
    }
  }, [word._id, word.word, word.img, updateWordImage, handleApiResult]);

  const handleRefreshExamples = useCallback(async () => {
    if (!word._id) return;

    try {
      await updateWordExamples(
        word._id,
        word.word,
        "en",
        (word.examples || []).join("\n")
      );
      toast.success("Ejemplos actualizados", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { examples: word.examples }, message: "Ejemplos actualizados" }, "Actualizar Ejemplos")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Ejemplos");
    }
  }, [word._id, word.word, word.examples, updateWordExamples, handleApiResult]);

  const handleRefreshSynonyms = useCallback(async () => {
    if (!word._id) return;

    try {
      await updateWordSynonyms(
        word._id,
        word.word,
        "en",
        (word.sinonyms || []).join("\n")
      );
      toast.success("Sinónimos actualizados", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { synonyms: word.sinonyms }, message: "Sinónimos actualizados" }, "Actualizar Sinónimos")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Sinónimos");
    }
  }, [word._id, word.word, word.sinonyms, updateWordSynonyms, handleApiResult]);

  const handleRefreshCodeSwitching = useCallback(async () => {
    if (!word._id) return;

    try {
      await updateWordCodeSwitching(
        word._id,
        word.word,
        "en",
        (word.codeSwitching || []).join("\n")
      );
      toast.success("Code-switching actualizado", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { codeSwitching: word.codeSwitching }, message: "Code-switching actualizado" }, "Actualizar Code-switching")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Code-switching");
    }
  }, [word._id, word.word, word.codeSwitching, updateWordCodeSwitching, handleApiResult]);

  const handleRefreshTypes = useCallback(async () => {
    if (!word._id) return;

    try {
      await updateWordTypes(
        word._id,
        word.word,
        "en",
        (word.type || []).join("\n")
      );
      toast.success("Tipos actualizados", {
        action: {
          label: <Eye className="h-4 w-4" />,
          onClick: () => handleApiResult({ success: true, data: { types: word.type }, message: "Tipos actualizados" }, "Actualizar Tipos")
        },
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => toast.dismiss()
        }
      });
    } catch (error: any) {
      handleApiResult(error, "Actualizar Tipos");
    }
  }, [word._id, word.word, word.type, updateWordTypes, handleApiResult]);

  // Memoizar valores computados
  const isCompact = useMemo(() => variant === "compact", [variant]);
  
  const containerClassName = useMemo(() => cn(
    "bg-zinc-950 text-zinc-100",
    isCompact ? "p-3" : variant === "modal" ? "p-0" : "p-6"
  ), [isCompact, variant]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "info" | "chat");
  }, []);

  // Funciones para el menú de selección de texto
  const handleSpeakText = useCallback((text: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = SPEECH_RATES.NORMAL;
    utterance.lang = "en-US";

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
    
    toast.success(`🔊 "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`, {
      description: "Reproduciendo audio...",
    });
  }, [isPlaying]);

  const handleCreateWord = useCallback((text: string) => {
    toast.success(`📖 Crear palabra: "${text}"`, {
      description: "Se abrirá el formulario de nueva palabra",
      action: {
        label: "Crear",
        onClick: () => {
          // Aquí se podría abrir un modal o navegar a crear palabra
          console.log('Crear palabra con texto:', text);
        }
      }
    });
  }, []);

  const handleCreateExpression = useCallback((text: string) => {
    toast.success(`📝 Crear expresión: "${text}"`, {
      description: "Se abrirá el formulario de nueva expresión",
      action: {
        label: "Crear",
        onClick: () => {
          // Aquí se podría abrir un modal o navegar a crear expresión
          console.log('Crear expresión con texto:', text);
        }
      }
    });
  }, []);

  return (
    <div className={containerClassName}>
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 sticky top-1 z-10">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="chat">
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="info"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <WordLevelBadge level={word.level} className="text-xs" />
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Eye className="h-3 w-3" />
                {word.seen || 0}
              </div>
            </div>
            {showAudioButtons && (
              <AudioButtons
                onSpeak={handleSpeakNormal}
                onSpeakSlow={handleSpeakSlow}
                isPlaying={isPlaying}
              />
            )}
          </div>

          {/* Word & Pronunciation */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white capitalize mb-1">
              {capitalize(word.word)}
            </h1>
            <p className="text-sm text-purple-400 font-mono">
              {word.IPA || "/ˈwɜːd/"}
            </p>
          </div>

          {/* Definition */}
          {word.definition && (
            <SectionContainer>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {capitalize(word.definition)}
              </p>
            </SectionContainer>
          )}

          {/* Spanish Translation */}
          {word.spanish && (
            <SectionContainer>
              <SectionHeader title="Traducción" icon="🇪🇸" showRefreshButtons={showRefreshButtons} />
              <h3 className="text-lg font-bold text-blue-400 capitalize mb-1">
                {capitalize(word.spanish.word)}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {capitalize(word.spanish.definition)}
              </p>
            </SectionContainer>
          )}

          {/* Image */}
          <SectionContainer loading={actionLoading.updateImage}>
            <SectionHeader
              title="Imagen"
              icon="🖼️"
              onRefresh={handleRefreshImage}
              loading={actionLoading.updateImage}
              showRefreshButtons={showRefreshButtons}
            />
            <div className="relative flex justify-center">
              {word.img ? (
                <img
                  src={word.img}
                  alt={word.word}
                  className="w-full max-w-xs rounded-lg max-h-96 object-contain border border-zinc-700"
                />
              ) : (
                <div className="w-full max-w-xs h-48 rounded-lg bg-zinc-800/50 border border-zinc-700 flex items-center justify-center">
                  <div className="text-center text-zinc-500">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="text-xs">Sin imagen</div>
                  </div>
                </div>
              )}
            </div>
          </SectionContainer>

          {/* Examples */}
          {word.examples && word.examples.length > 0 && (
            <SectionContainer loading={actionLoading.updateExamples}>
              <SectionHeader
                title="Ejemplos"
                icon="💬"
                onRefresh={handleRefreshExamples}
                loading={actionLoading.updateExamples}
                showRefreshButtons={showRefreshButtons}
              />
              <div 
                ref={examplesRef}
                className="space-y-2 relative"
              >
                {word.examples.map((example, index) => (
                  <p
                    key={index}
                    className="text-sm text-zinc-300 leading-relaxed cursor-text select-text"
                    style={{ userSelect: 'text' }}
                  >
                    • {example}
                  </p>
                ))}
                
                {/* Menú de selección de texto dentro del contenedor */}
                <TextSelectionMenu
                  selectedText={selectedText}
                  position={menuPosition}
                  show={showMenu}
                  onSpeak={handleSpeakText}
                  onCreateWord={handleCreateWord}
                  onCreateExpression={handleCreateExpression}
                  onClose={clearSelection}
                />
              </div>
            </SectionContainer>
          )}

          {/* Code Switching */}
          {word.codeSwitching && word.codeSwitching.length > 0 && (
            <SectionContainer loading={actionLoading.updateCodeSwitching}>
              <SectionHeader
                title="Code-Switching"
                icon="🔀"
                onRefresh={handleRefreshCodeSwitching}
                loading={actionLoading.updateCodeSwitching}
                showRefreshButtons={showRefreshButtons}
              />
              <div className="space-y-2">
                {word.codeSwitching.map((example, index) => (
                  <p
                    key={index}
                    className="text-sm text-zinc-300 leading-relaxed"
                  >
                    • {example}
                  </p>
                ))}
              </div>
            </SectionContainer>
          )}

          {/* Synonyms */}
          {word.sinonyms && word.sinonyms.length > 0 && (
            <SectionContainer loading={actionLoading.updateSynonyms}>
              <SectionHeader
                title="Sinónimos"
                icon="🔗"
                onRefresh={handleRefreshSynonyms}
                loading={actionLoading.updateSynonyms}
                showRefreshButtons={showRefreshButtons}
              />
              <div className="flex flex-wrap gap-2">
                {word.sinonyms.map((synonym, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-200 capitalize"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </SectionContainer>
          )}

          {/* Word Types */}
          {word.type && word.type.length > 0 && (
            <SectionContainer loading={actionLoading.updateTypes}>
              <SectionHeader
                title="Tipos"
                icon="🏷️"
                onRefresh={handleRefreshTypes}
                loading={actionLoading.updateTypes}
                showRefreshButtons={showRefreshButtons}
              />
              <div className="flex flex-wrap gap-2">
                {word.type.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-900/30 border border-purple-700/30 rounded text-xs text-purple-300 capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </SectionContainer>
          )}

          {/* Dates */}
          <SectionContainer className="border-orange-500/30">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-semibold text-zinc-400 mb-1">
                  Actualizado
                </h4>
                <p className="text-zinc-500">
                  {word.updatedAt ? formatDateShort(word.updatedAt) : "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-zinc-400 mb-1">Creado</h4>
                <p className="text-zinc-500">
                  {word.createdAt ? formatDateShort(word.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </SectionContainer>

          {/* Level Buttons */}
          {showLevelButtons && (
            <LevelButtons
              onUpdateLevel={handleUpdateLevel}
              loading={actionLoading.updateLevel}
              currentLevel={word.level}
              variant={variant}
            />
          )}
        </TabsContent>

        <TabsContent value="chat">
          <WordChatTab word={word} />
        </TabsContent>
      </Tabs>


    </div>
  );
});
