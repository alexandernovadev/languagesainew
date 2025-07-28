import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Volume2 } from "lucide-react";
import { Word } from "@/models/Word";
import { cn } from "@/utils/common/classnames";
import { WordLevelBadge } from "@/components/WordLevelBadge";
import { SPEECH_RATES } from "../../speechRates";
import { formatDateShort } from "@/utils/common/time";
import { useWordStore } from "@/lib/store/useWordStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordChatTab } from "./WordChatTab";

interface WordDetailsCardProps {
  word: Word;
  variant?: "full" | "compact" | "modal";
  showLevelButtons?: boolean;
  showRefreshButtons?: boolean;
  showAudioButtons?: boolean;
}

export function WordDetailsCard({
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
    actionLoading,
  } = useWordStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "chat">("info");

  const speakWord = (rate = SPEECH_RATES.NORMAL, language = "en-US") => {
    if (isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.rate = rate;
    utterance.lang = language;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const handleUpdateLevel = async (level: "easy" | "medium" | "hard") => {
    if (!word._id) return;

    try {
      await updateWordLevel(word._id, level);
      toast.success(`Nivel actualizado a ${level}`);
    } catch (error: any) {
      toast.error(`Error al actualizar nivel: ${error.message}`);
    }
  };

  const handleRefreshImage = async () => {
    if (!word._id) return;

    try {
      await updateWordImage(word._id, word.word, word.img || "");
      toast.success("Imagen actualizada");
    } catch (error: any) {
      toast.error(`Error al actualizar imagen: ${error.message}`);
    }
  };

  const handleRefreshExamples = async () => {
    if (!word._id) return;

    try {
      await updateWordExamples(
        word._id,
        word.word,
        "en",
        (word.examples || []).join("\n")
      );
      toast.success("Ejemplos actualizados");
    } catch (error: any) {
      toast.error(`Error al actualizar ejemplos: ${error.message}`);
    }
  };

  const handleRefreshSynonyms = async () => {
    if (!word._id) return;

    try {
      await updateWordSynonyms(
        word._id,
        word.word,
        "en",
        (word.sinonyms || []).join("\n")
      );
      toast.success("Sinónimos actualizados");
    } catch (error: any) {
      toast.error(`Error al actualizar sinónimos: ${error.message}`);
    }
  };

  const handleRefreshCodeSwitching = async () => {
    if (!word._id) return;

    try {
      await updateWordCodeSwitching(
        word._id,
        word.word,
        "en",
        (word.codeSwitching || []).join("\n")
      );
      toast.success("Code-switching actualizado");
    } catch (error: any) {
      toast.error(`Error al actualizar code-switching: ${error.message}`);
    }
  };

  const handleRefreshTypes = async () => {
    if (!word._id) return;

    try {
      await updateWordTypes(
        word._id,
        word.word,
        "en",
        (word.type || []).join("\n")
      );
      toast.success("Tipos actualizados");
    } catch (error: any) {
      toast.error(`Error al actualizar tipos: ${error.message}`);
    }
  };

  const SectionContainer = ({
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
  );

  const SectionHeader = ({
    title,
    onRefresh,
    loading = false,
    icon,
  }: {
    title: string;
    onRefresh?: () => void;
    loading?: boolean;
    icon?: string;
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
  );

  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "bg-zinc-950 text-zinc-100",
        isCompact ? "p-3" : variant === "modal" ? "p-0" : "p-6"
      )}
    >
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "info" | "chat")}
      >
        <TabsList className="grid w-full grid-cols-2 sticky top-1 z-10">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            Chat
            <span className="px-2 text-sm bg-primary/20 text-primary rounded-md capitalize">
              {word.word}
            </span>
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
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord()}
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
                  onClick={() => speakWord(SPEECH_RATES.SUPERSLOW)}
                  disabled={isPlaying}
                  className="h-7 w-7 p-0 bg-zinc-800/50 hover:bg-zinc-700/50"
                >
                  🐢
                </Button>
              </div>
            )}
          </div>

          {/* Word & Pronunciation */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white capitalize mb-1">
              {word.word}
            </h1>
            <p className="text-sm text-purple-400 font-mono">
              {word.IPA || "/ˈwɜːd/"}
            </p>
          </div>

          {/* Definition */}
          {word.definition && (
            <SectionContainer>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {word.definition}
              </p>
            </SectionContainer>
          )}

          {/* Spanish Translation */}
          {word.spanish && (
            <SectionContainer>
              <SectionHeader title="Traducción" icon="🇪🇸" />
              <h3 className="text-lg font-bold text-blue-400 capitalize mb-1">
                {word.spanish.word}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {word.spanish.definition}
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
              />
              <div className="space-y-2">
                {word.examples.map((example, index) => (
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

          {/* Code Switching */}
          {word.codeSwitching && word.codeSwitching.length > 0 && (
            <SectionContainer loading={actionLoading.updateCodeSwitching}>
              <SectionHeader
                title="Code-Switching"
                icon="🔀"
                onRefresh={handleRefreshCodeSwitching}
                loading={actionLoading.updateCodeSwitching}
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
          {showLevelButtons && variant !== "modal" && (
            <div className="flex justify-center gap-2 mt-4">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => handleUpdateLevel(level)}
                  disabled={actionLoading.updateLevel}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "capitalize px-3 py-1 text-xs",
                    level === "easy" &&
                      "border-green-600 text-green-400 hover:bg-green-600 hover:text-white",
                    level === "medium" &&
                      "border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white",
                    level === "hard" &&
                      "border-red-600 text-red-400 hover:bg-red-600 hover:text-white",
                    actionLoading.updateLevel && "opacity-50"
                  )}
                >
                  {level}
                </Button>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat">
          <WordChatTab word={word} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
