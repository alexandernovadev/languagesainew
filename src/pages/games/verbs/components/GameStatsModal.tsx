import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Calendar, Target, Clock, CheckCircle, XCircle } from "lucide-react";
import { GameSession } from "../types";
import { 
  formatDateToSpanish, 
  calculateGameDuration, 
  getScoreColor, 
  getScoreIcon, 
  getScoreMessage 
} from "../utils";

interface GameStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: GameSession | null;
  totalVerbs: number;
  onClose: () => void;
  // Props para historial
  isHistory?: boolean;
  historyItem?: any;
}

export function GameStatsModal({ 
  open, 
  onOpenChange, 
  session, 
  totalVerbs, 
  onClose,
  isHistory = false,
  historyItem
}: GameStatsModalProps) {
  if (!session && !historyItem) return null;

  // Usar datos del historial si está disponible
  const data = isHistory && historyItem ? historyItem : session;
  if (!data) return null;

  const correctAnswers = Object.values(data.checkedAnswers).filter(Boolean).length;
  const totalVerbsCount = isHistory ? data.config.totalVerbs : totalVerbs;
  const percentage = Math.round((correctAnswers / totalVerbsCount) * 100);
  
  // Calcular duración - para historial usar la fecha guardada
  const gameDuration = isHistory && historyItem 
    ? Math.round((new Date(historyItem.finishedAt).getTime() - new Date(data.startTime).getTime()) / 1000 / 60)
    : calculateGameDuration(data.startTime);
  
  // Fecha - para historial usar la fecha de finalización
  const displayDate = isHistory && historyItem 
    ? formatDateToSpanish(new Date(historyItem.finishedAt))
    : formatDateToSpanish(new Date());

  const title = isHistory ? "Detalle de Partida" : "¡Partida Completada!";
  const description = isHistory 
    ? "Revisa los detalles de esta partida anterior"
    : "¡Felicitaciones por completar la partida!";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border border-gray-600 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center p-4 rounded-full ${getScoreColor(percentage)} mb-4`}>
              <span className="text-4xl mr-2">{getScoreIcon(percentage)}</span>
              <span className="text-3xl font-bold">{percentage}%</span>
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              {getScoreMessage(percentage)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Respuestas Correctas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {correctAnswers} / {totalVerbsCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dificultad</p>
                    <p className="text-2xl font-bold text-blue-600 capitalize">
                      {data.config.difficulty}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tiempo de Juego</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {gameDuration} min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="text-sm font-medium text-orange-600">
                      {displayDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verbos por página:</span>
                  <Badge variant="secondary">{data.config.itemsPerPage}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de páginas:</span>
                  <Badge variant="secondary">{Math.ceil(totalVerbsCount / data.config.itemsPerPage)}</Badge>
                </div>
                {data.config.shuffle && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Modo:</span>
                    <Badge variant="secondary">Mezclado</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 