import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw } from "lucide-react";
import { Word } from "@/models/Word";
import { cn } from "@/utils/common/classnames";
import { WordLevelBadge } from "@/components/WordLevelBadge";
import { SPEECH_RATES } from "../speechRates";
import { formatDateShort } from "@/utils/common/time";

interface WordDetailsModalProps {
  word: Word;
  onClose: () => void;
  onUpdateLevel?: (level: "easy" | "medium" | "hard") => void;
  onRefreshImage?: () => void;
  onRefreshExamples?: () => void;
  onRefreshSynonyms?: () => void;
  onRefreshCodeSwitching?: () => void;
  onRefreshTypes?: () => void;
  loading?: boolean;
  loadingImage?: boolean;
  loadingExamples?: boolean;
  loadingSynonyms?: boolean;
  loadingCodeSwitching?: boolean;
  loadingTypes?: boolean;
}

export function WordDetailsModal({
  word,
  onClose,
  onUpdateLevel,
  onRefreshImage,
  onRefreshExamples,
  onRefreshSynonyms,
  onRefreshCodeSwitching,
  onRefreshTypes,
  loading = false,
  loadingImage = false,
  loadingExamples = false,
  loadingSynonyms = false,
  loadingCodeSwitching = false,
  loadingTypes = false,
}: WordDetailsModalProps) {
  const speakWord = (rate = SPEECH_RATES.NORMAL, language = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.rate = rate;
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  };

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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇺🇸</span>
            <WordLevelBadge level={word.level} className="text-sm" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            {/* Word Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary capitalize mb-1">
                  {word.word}
                </h1>
                <p className="text-yellow-600 font-semibold text-sm">
                  👀 {word.seen || 0} vistas
                </p>
              </div>
            </div>

            {/* Pronunciation */}
            <div className="flex items-center justify-between">
              <p className="text-lg text-purple-600 font-semibold">
                {word.IPA || "/ˈwɜːd/"}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord()}
                  className="h-9 w-9 p-0 rounded-full border-2"
                >
                  🔊
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord(SPEECH_RATES.SUPERSLOW)}
                  className="h-9 w-9 p-0 rounded-full border-2"
                >
                  🐢
                </Button>
              </div>
            </div>

            {/* Definition */}
            <div>
              <p className="text-base text-muted-foreground leading-relaxed">
                {word.definition}
              </p>
            </div>

            {/* Spanish Translation */}
            <SectionContainer>
              <h3 className="text-xl font-bold text-blue-600 capitalize mb-2">
                {word.spanish?.word}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {word.spanish?.definition}
              </p>
            </SectionContainer>

            {/* Image */}
            <SectionContainer hasBox>
              <div className="relative flex justify-center">
                {onRefreshImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefreshImage}
                    disabled={loadingImage}
                    className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-background/80 rounded-full"
                  >
                    <RefreshCw
                      className={cn("h-4 w-4", loadingImage && "animate-spin")}
                    />
                  </Button>
                )}
                {word.img ? (
                  <img
                    src={word.img}
                    alt={word.word}
                    className="w-2/3 rounded-lg h-64 object-cover"
                  />
                ) : (
                  <div className="w-2/3 h-64 rounded-lg bg-muted flex items-center justify-center">
                    <img
                      src="/placeholder.svg"
                      alt="No image available"
                      className="w-20 h-20 opacity-50"
                    />
                  </div>
                )}
              </div>
            </SectionContainer>

            {/* Examples */}
            {word.examples && word.examples.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader
                  title="Examples"
                  onRefresh={onRefreshExamples}
                  loading={loadingExamples}
                />
                <div className="space-y-2">
                  {word.examples.map((example, index) => (
                    <p
                      key={index}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      • {example}
                    </p>
                  ))}
                </div>
              </SectionContainer>
            )}

            {/* Code Switching */}
            {word.codeSwitching && word.codeSwitching.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader
                  title="Code-Switching"
                  onRefresh={onRefreshCodeSwitching}
                  loading={loadingCodeSwitching}
                />
                <div className="space-y-2">
                  {word.codeSwitching.map((example, index) => (
                    <p
                      key={index}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      • {example}
                    </p>
                  ))}
                </div>
              </SectionContainer>
            )}

            {/* Synonyms */}
            {word.sinonyms && word.sinonyms.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader
                  title="Synonyms"
                  onRefresh={onRefreshSynonyms}
                  loading={loadingSynonyms}
                />
                <div className="space-y-2">
                  {word.sinonyms.map((synonym, index) => (
                    <p
                      key={index}
                      className="text-sm text-foreground capitalize leading-relaxed"
                    >
                      🔹 {synonym}
                    </p>
                  ))}
                </div>
              </SectionContainer>
            )}

            {/* Word Types */}
            {word.type && word.type.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader
                  title="Word Types"
                  onRefresh={onRefreshTypes}
                  loading={loadingTypes}
                />
                <div className="space-y-2">
                  {word.type.map((type, index) => (
                    <p
                      key={index}
                      className="text-sm text-foreground capitalize leading-relaxed"
                    >
                      🪹 {type}
                    </p>
                  ))}
                </div>
              </SectionContainer>
            )}

            {/* Dates */}
            <SectionContainer hasBox className="border-orange-500">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1 text-sm">
                    Updated
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {word.updatedAt ? formatDateShort(word.updatedAt) : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1 text-sm">
                    Created
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {word.createdAt ? formatDateShort(word.createdAt) : "N/A"}
                  </p>
                </div>
              </div>
            </SectionContainer>
          </div>
        </ScrollArea>

        {/* Level Buttons */}
        {onUpdateLevel && (
          <div className="p-5 border-t flex-shrink-0">
            <div className="flex justify-center gap-3">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => onUpdateLevel(level)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "capitalize px-4 py-2",
                    level === "easy" &&
                      "border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
                    level === "medium" &&
                      "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
                    level === "hard" &&
                      "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
                    loading && "opacity-50"
                  )}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
