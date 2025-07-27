import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { wordService } from "@/services/wordService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReviewStats {
  totalWords: number;
  wordsReviewedToday: number;
  wordsDueForReview: number;
  averageEaseFactor: number;
  averageInterval: number;
}

interface AnkiStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnkiStatsModal({ open, onOpenChange }: AnkiStatsModalProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      const fetchStats = async () => {
        try {
          setLoading(true);
          const response = await wordService.getReviewStats();
          setStats(response.data);
        } catch (error) {
          console.error('Error fetching review stats:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [open]);

  const progressPercentage = stats && stats.totalWords > 0 
    ? Math.round((stats.wordsReviewedToday / stats.totalWords) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border border-gray-600 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Estadísticas de Repaso Anki
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Palabras</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalWords}</div>
                  <p className="text-xs text-muted-foreground">
                    Palabras en el sistema
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Repasadas Hoy</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.wordsReviewedToday}</div>
                  <p className="text-xs text-muted-foreground">
                    {progressPercentage}% del total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.wordsDueForReview}</div>
                  <p className="text-xs text-muted-foreground">
                    Necesitan repaso
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Facilidad Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageEaseFactor.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Intervalo: {stats.averageInterval.toFixed(1)} días
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 