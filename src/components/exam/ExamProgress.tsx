import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Grid3X3, X } from 'lucide-react';

interface ExamProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: number[];
  onQuestionClick: (index: number) => void;
}

export function ExamProgress({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  onQuestionClick
}: ExamProgressProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getQuestionStatus = (index: number) => {
    if (index === currentIndex) return 'current';
    if (answeredQuestions.includes(index)) return 'answered';
    return 'unanswered';
  };

  const handleQuestionClick = (index: number) => {
    onQuestionClick(index);
    setIsModalOpen(false);
  };

  // Barra de progreso visual
  const progressPercent = Math.round((answeredQuestions.length / totalQuestions) * 100);

  // Botón de pregunta premium
  const renderQuestionButton = (index: number) => {
    const status = getQuestionStatus(index);
    let base =
      'flex items-center justify-center rounded-full transition-all duration-200 font-bold select-none text-sm w-10 h-10 shadow-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-400/40 ';
    let style = '';
    let pulse = '';
    if (status === 'current') {
      style = 'bg-blue-600 text-white border-blue-400 shadow-blue-500/40';
      pulse = 'animate-pulse-slow';
    } else if (status === 'answered') {
      style = 'bg-green-500 text-white border-green-400 shadow-green-500/30';
    } else {
      style = 'bg-black/30 text-gray-400 border-gray-700 hover:border-blue-400 hover:shadow-blue-400/20';
    }
    return (
      <button
        key={index}
        onClick={() => handleQuestionClick(index)}
        className={
          base +
          style +
          ' hover:scale-110 active:scale-95 ' +
          pulse
        }
        tabIndex={0}
        aria-label={`Ir a pregunta ${index + 1}`}
      >
        {status === 'answered' ? (
          <CheckCircle className="h-5 w-5 text-white drop-shadow-lg" strokeWidth={3} />
        ) : (
          <span>{index + 1}</span>
        )}
      </button>
    );
  };

  // Leyenda compacta
  const LegendCircle = ({ type }: { type: 'current' | 'answered' | 'unanswered' }) => {
    let style = 'inline-block w-5 h-5 rounded-full border-2 mr-1 align-middle';
    if (type === 'current') {
      style += ' bg-blue-600 border-blue-400 shadow-blue-500/40 animate-pulse-slow';
    } else if (type === 'answered') {
      style += ' bg-green-500 border-green-400 shadow-green-500/30';
    } else {
      style += ' bg-black/30 border-gray-700';
    }
    return <span className={style} />;
  };

  return (
    <>
      {/* Progress Summary with Navigation Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold">Progreso del examen</h3>
          <div className="text-sm text-muted-foreground">
            {answeredQuestions.length} de {totalQuestions} respondidas
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 shadow-md text-xs px-3 py-1"
        >
          <Grid3X3 className="h-4 w-4" />
          Navegar
        </Button>
      </div>

      {/* Navigation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-xl h-[90vh] max-h-[600px] overflow-hidden bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-2">
            <DialogTitle className="flex items-center justify-between text-lg font-bold">
              <span>Navegar entre preguntas</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Contenido fijo superior */}
            <div className="flex-shrink-0 space-y-3 pb-3">
              {/* Barra de progreso visual */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-3 bg-gradient-to-r from-blue-500 to-green-400 rounded-full transition-all duration-300 shadow-lg"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-base font-bold text-white/90 min-w-[40px] text-right">
                  {progressPercent}%
                </span>
              </div>
              <div className="text-base text-white/90 font-semibold">
                Progreso: <span className="font-bold">{answeredQuestions.length} de {totalQuestions}</span> respondidas
              </div>
            </div>

            {/* Grid de preguntas con scroll */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 p-3 rounded-lg">
                {Array.from({ length: totalQuestions }, (_, i) => renderQuestionButton(i))}
              </div>
            </div>

            {/* Leyenda fija inferior */}
            <div className="flex-shrink-0 pt-3 border-t border-white/10">
              <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <LegendCircle type="current" />
                  <span>Actual</span>
                </div>
                <div className="flex items-center gap-1">
                  <LegendCircle type="answered" />
                  <span>Respondida</span>
                </div>
                <div className="flex items-center gap-1">
                  <LegendCircle type="unanswered" />
                  <span>Sin responder</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Animación pulse lenta */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(59,130,246,0.15); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s cubic-bezier(0.4,0,0.6,1) infinite;
        }
      `}</style>
    </>
  );
} 