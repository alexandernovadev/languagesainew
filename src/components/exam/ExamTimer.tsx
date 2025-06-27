import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  formatTime: (seconds: number) => string;
}

export function ExamTimer({ timeRemaining, isRunning, formatTime }: ExamTimerProps) {
  const isWarning = timeRemaining <= 300; // 5 minutes
  const isCritical = timeRemaining <= 60; // 1 minute

  const getTimerColor = () => {
    if (isCritical) return 'text-red-500 border-red-500/30 bg-red-500/10 dark:bg-red-500/20';
    if (isWarning) return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10 dark:bg-yellow-500/20';
    return 'text-blue-500 border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/20';
  };

  const getIcon = () => {
    if (isCritical) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <Card className={`border ${getTimerColor()}`}>
      <CardContent className="p-1.5">
        <div className="flex items-center gap-1">
          {getIcon()}
          <span className="font-mono font-semibold text-base">
            {formatTime(timeRemaining)}
          </span>
          {isRunning && (
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
          )}
        </div>
        <div className="text-[10px] mt-0.5 opacity-75">
          {isCritical ? '¡Tiempo crítico!' : isWarning ? 'Poco tiempo' : 'Tiempo restante'}
        </div>
      </CardContent>
    </Card>
  );
} 