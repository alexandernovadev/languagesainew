import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain } from "lucide-react";

interface StatsLevelDistributionProps {
  stats: {
    byLevel: {
      lectures: {
        A1: number;
        A2: number;
        B1: number;
        B2: number;
        C1: number;
        C2: number;
      };
      words: {
        easy: number;
        medium: number;
        hard: number;
      };
    };
  };
}

const levelBadgeVariant: Record<string, any> = {
  A1: "blue",
  A2: "silver",
  B1: "secondary",
  B2: "default",
  C1: "yellow",
  C2: "magenta",
};

const wordBadgeVariant: Record<string, any> = {
  "Fácil": "default",
  "Medio": "blue",
  "Difícil": "destructive",
};

export function StatsLevelDistribution({ stats }: StatsLevelDistributionProps) {
  const lectureLevels = [
    { level: "A1", count: stats.byLevel.lectures.A1 },
    { level: "A2", count: stats.byLevel.lectures.A2 },
    { level: "B1", count: stats.byLevel.lectures.B1 },
    { level: "B2", count: stats.byLevel.lectures.B2 },
    { level: "C1", count: stats.byLevel.lectures.C1 },
    { level: "C2", count: stats.byLevel.lectures.C2 },
  ];

  const wordLevels = [
    { level: "Fácil", count: stats.byLevel.words.easy },
    { level: "Medio", count: stats.byLevel.words.medium },
    { level: "Difícil", count: stats.byLevel.words.hard },
  ];

  const totalLectures = Object.values(stats.byLevel.lectures).reduce((sum, count) => sum + count, 0);
  const totalWords = Object.values(stats.byLevel.words).reduce((sum, count) => sum + count, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Distribución de Lecturas por Nivel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Lecturas por Nivel
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: {totalLectures} lecturas
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {lectureLevels.map(({ level, count }) => {
            const percentage = totalLectures > 0 ? (count / totalLectures) * 100 : 0;
            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={levelBadgeVariant[level] || "default"}>{level}</Badge>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Distribución de Palabras por Nivel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Palabras por Dificultad
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: {totalWords} palabras
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {wordLevels.map(({ level, count }) => {
            const percentage = totalWords > 0 ? (count / totalWords) * 100 : 0;
            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={wordBadgeVariant[level] || "default"}>{level}</Badge>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
} 