import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { wordService } from "@/services/wordService";
import { IWord } from "@/types/models/Word";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AnkiCard } from "@/shared/components/anki/AnkiCard";
import {
  AnkiFilter,
  AnkiFilterValues,
  DEFAULT_FILTERS,
} from "@/shared/components/anki/AnkiFilter";

export default function AnkiGamePage() {
  const [cards, setCards] = useState<IWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filters, setFilters] = useState<AnkiFilterValues>(DEFAULT_FILTERS);

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const difficulty =
        filters.difficulty.length > 0 ? filters.difficulty : DEFAULT_FILTERS.difficulty;
      const response = await wordService.getAnkiCards({
        mode: "random",
        limit: filters.limit,
        difficulty,
      });
      
      if (response.success && response.data) {
        setCards(response.data);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        toast.error('Error cargando las tarjetas Anki');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Error cargando las tarjetas Anki';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Juego Anki"
        description="Practica con tarjetas Anki"
        actions={
          <AnkiFilter
            values={filters}
            onChange={setFilters}
            disabled={loading}
          />
        }
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-8">
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-8 w-3/4 mx-auto" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!loading && cards.length === 0 && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay tarjetas disponibles</p>
            <Button onClick={loadCards} className="mt-4">
              Recargar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cards Display */}
      {!loading && cards.length > 0 && currentCard && (
        <div className="flex flex-col items-center gap-4">
          {/* Card Container */}
          <div className="w-full max-w-4xl">
            <AnkiCard
              word={currentCard}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground min-w-[100px] text-center">
              {currentIndex + 1} / {cards.length}
            </span>
            
            <Button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              variant="outline"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
