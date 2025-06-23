import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Volume2, RefreshCw, Eye } from "lucide-react"
import { Word } from "@/models/Word"
import { cn } from "@/lib/utils"

interface WordDetailsModalProps {
  word: Word
  onClose: () => void
  onUpdateLevel?: (level: "easy" | "medium" | "hard") => void
  loading?: boolean
}

export function WordDetailsModal({
  word,
  onClose,
  onUpdateLevel,
  loading = false,
}: WordDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const speakWord = (rate = 0.8, language = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.rate = rate
    utterance.lang = language
    speechSynthesis.speak(utterance)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "easy":
        return "text-green-600 border-green-600"
      case "medium":
        return "text-blue-600 border-blue-600"
      case "hard":
        return "text-red-600 border-red-600"
      default:
        return "text-gray-600 border-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const SectionContainer = ({ 
    children, 
    hasBox = false, 
    className = "" 
  }: { 
    children: React.ReactNode
    hasBox?: boolean
    className?: string
  }) => (
    <div className={cn(
      "my-2",
      hasBox && "border border-border rounded-lg p-4 relative",
      className
    )}>
      {children}
    </div>
  )

  const SectionHeader = ({ 
    title
  }: { 
    title: string
  }) => (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇺🇸</span>
            <Badge 
              variant="outline" 
              className={cn("text-sm font-semibold", getLevelColor(word.level || "easy"))}
            >
              {word.level}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Word Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary capitalize">
                  {word.word}
                </h1>
                <p className="text-yellow-600 font-semibold">
                  👀 {word.seen || 0}
                </p>
              </div>
            </div>

            {/* Pronunciation */}
            <div className="flex items-center justify-between">
              <p className="text-xl text-purple-600 font-semibold">
                {word.IPA || "/ˈwɜːd/"}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord()}
                  className="h-10 w-10 p-0 rounded-full border-2"
                >
                  🔊
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord(0.5)}
                  className="h-10 w-10 p-0 rounded-full border-2"
                >
                  🐢
                </Button>
              </div>
            </div>

            {/* Definition */}
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {word.definition}
              </p>
            </div>

            {/* Spanish Translation */}
            <SectionContainer>
              <h3 className="text-2xl font-bold text-blue-600 capitalize mb-2">
                {word.spanish?.word}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {word.spanish?.definition}
              </p>
            </SectionContainer>

            {/* Image */}
            <SectionContainer hasBox>
              <div className="relative flex justify-center">
                {word.img ? (
                  <img
                    src={word.img}
                    alt={word.word}
                    className="w-1/2 rounded-lg h-80 object-cover"
                  />
                ) : (
                  <div className="w-1/2 h-80 rounded-lg bg-muted flex items-center justify-center">
                    <img
                      src="/placeholder.svg"
                      alt="No image available"
                      className="w-32 h-32 opacity-50"
                    />
                  </div>
                )}
              </div>
            </SectionContainer>

            {/* Examples */}
            {word.examples && word.examples.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader title="Examples" />
                <div className="space-y-2">
                  {word.examples.map((example, index) => (
                    <p key={index} className="text-muted-foreground">
                      • {example}
                    </p>
                  ))}
                </div>
              </SectionContainer>
            )}

            {/* Code Switching */}
            {word.codeSwitching && word.codeSwitching.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader title="Code-Switching" />
                <div className="space-y-2">
                  {word.codeSwitching.map((example, index) => (
                    <p key={index} className="text-muted-foreground">
                      • {example}
                    </p>
                  ))}
                </div>
              </SectionContainer>
            )}

            {/* Synonyms */}
            {word.sinonyms && word.sinonyms.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader title="Synonyms" />
                <div className="space-y-2">
                  {word.sinonyms.map((synonym, index) => (
                    <p key={index} className="text-foreground capitalize">
                      🔹 {synonym}
                    </p>
                  ))}
                </div>
              </SectionContainer>
            )}

            {/* Word Types */}
            {word.type && word.type.length > 0 && (
              <SectionContainer hasBox>
                <SectionHeader title="Word Types" />
                <div className="space-y-2">
                  {word.type.map((type, index) => (
                    <p key={index} className="text-foreground capitalize">
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
                  <h4 className="font-semibold text-muted-foreground mb-1">Updated</h4>
                  <p className="text-sm text-muted-foreground">
                    {word.updatedAt ? formatDate(word.updatedAt) : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-1">Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {word.createdAt ? formatDate(word.createdAt) : "N/A"}
                  </p>
                </div>
              </div>
            </SectionContainer>
          </div>
        </ScrollArea>

        {/* Level Buttons */}
        {onUpdateLevel && (
          <div className="p-6 border-t flex-shrink-0">
            <div className="flex justify-center gap-4">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => onUpdateLevel(level)}
                  disabled={loading}
                  variant="outline"
                  className={cn(
                    "capitalize",
                    level === "easy" && "border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
                    level === "medium" && "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
                    level === "hard" && "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
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
  )
} 