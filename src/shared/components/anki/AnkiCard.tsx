import { useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { IWord } from '@/types/models/Word';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/utils/common/classnames';
import { WordDetailTabs } from '../word-detail/WordDetailTabs';
import { useWordDetail } from '@/shared/hooks/useWordDetail';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface AnkiCardProps {
  word: IWord;
  isFlipped: boolean;
  onFlip: () => void;
}

export function AnkiCard({ word, isFlipped, onFlip }: AnkiCardProps) {

  // Use wordDetail hook for managing word state and functions
  // Pasar word como initialWord para evitar llamada API innecesaria
  const {
    word: updatedWord,
    loadingImage,
    loadingSynonyms,
    loadingExamples,
    loadingTypes,
    loadingCodeSwitching,
    loadingAll,
    loadingChat,
    refreshImage,
    refreshSynonyms,
    refreshExamples,
    refreshTypes,
    refreshCodeSwitching,
    refreshAll,
    sendMessage,
    clearChat,
    incrementSeen,
    updateDifficulty,
  } = useWordDetail({
    wordId: word._id,
    initialWord: word, // Pasar la palabra completa para evitar llamada API
    onWordUpdate: (updated) => {
      // Word is updated automatically by the hook
    }
  });

  // Use updated word if available, otherwise use original
  const displayWord = updatedWord || word;

  // Track previous flipped state to detect when card is flipped
  const prevFlippedRef = useRef(false);

  // Increment seen when card is flipped (only once per flip)
  useEffect(() => {
    if (isFlipped && !prevFlippedRef.current && displayWord) {
      // Card was just flipped from false to true
      incrementSeen();
    }
    prevFlippedRef.current = isFlipped;
  }, [isFlipped, displayWord, incrementSeen]);

  const speak = (text: string, lang: string = 'en-US', rate: number = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    onFlip();
  };

  const handleAudioClick = (e: React.MouseEvent, rate: number = 1) => {
    e.stopPropagation();
    speak(displayWord.word, 'en-US', rate);
  };

  return (
    <div
      className="relative w-full flex-1 min-h-[520px] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={handleFlip}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500"
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRENTE */}
        <Card
          className={cn(
            "absolute w-full h-full",
            "flex flex-col items-center justify-center p-8"
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <CardContent className="flex flex-col items-center justify-center h-full w-full">
            {displayWord.img && (
              <img
                src={displayWord.img}
                alt={displayWord.word}
                className="w-80 h-96 object-contain rounded-xl mb-6"
              />
            )}

            <div className="flex flex-col items-center gap-3 mb-4">

              {/* Botones de audio - FRENTE */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleAudioClick(e, 1)}
                  className="p-2 border rounded-lg hover:bg-muted transition-colors hover:scale-110"
                  title="Reproducir velocidad normal"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => handleAudioClick(e, 0.1)}
                  className="p-2 border rounded-lg hover:bg-muted transition-colors hover:scale-110 text-xl leading-none"
                  title="Reproducir velocidad lenta"
                >
                  🐢
                </button>
              </div>
              <h2 className="text-3xl font-bold capitalize lg:text-5xl">{displayWord.word}</h2>

            </div>

            {displayWord.IPA && (
              <span className="text-lg font-mono text-muted-foreground bg-muted px-3 py-1 rounded">
                /{displayWord.IPA}/
              </span>
            )}

            <p className="text-sm text-muted-foreground mt-6">
              Click para voltear
            </p>
          </CardContent>
        </Card>

        {/* REVERSO */}
        <Card
          className={cn(
            "absolute w-full h-full",
            "flex flex-col overflow-hidden"
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <CardContent className="flex flex-col h-full p-0 relative">
            {/* WordDetailTabs */}
            <div className="flex-1 min-h-0" onClick={(e) => e.stopPropagation()}>
              {displayWord ? (
                <WordDetailTabs
                  cardId={displayWord._id}
                  word={displayWord}
                  loadingImage={loadingImage}
                  loadingSynonyms={loadingSynonyms}
                  loadingExamples={loadingExamples}
                  loadingTypes={loadingTypes}
                  loadingCodeSwitching={loadingCodeSwitching}
                  loadingChat={loadingChat}
                  loadingAll={loadingAll}
                  onRefreshImage={refreshImage}
                  onRefreshSynonyms={refreshSynonyms}
                  onRefreshExamples={refreshExamples}
                  onRefreshTypes={refreshTypes}
                  onRefreshCodeSwitching={refreshCodeSwitching}
                  onRefreshAll={refreshAll}
                  onSendMessage={sendMessage}
                  onClearChat={clearChat}
                  onUpdateDifficulty={updateDifficulty}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-64 w-full" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
