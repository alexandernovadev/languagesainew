interface GameStatsDisplayProps {
  pageStats: {
    correct: number;
    total: number;
    percentage: number;
    color: string;
    icon: string;
  } | null;
}

export function GameStatsDisplay({ pageStats }: GameStatsDisplayProps) {
  if (!pageStats) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-muted shadow-sm`}>
      <span className={`text-xl font-bold ${pageStats.color}`}>{pageStats.icon}</span>
      <span className={`font-semibold text-lg ${pageStats.color}`}>
        {pageStats.correct}/{pageStats.total}
      </span>
      <span className="text-muted-foreground">correctas —</span>
      <span className={`font-bold ${pageStats.color}`}>{pageStats.percentage}%</span>
    </div>
  );
} 