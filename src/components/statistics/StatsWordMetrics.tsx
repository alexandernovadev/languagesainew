import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, FileText, Image, Brain } from "lucide-react";

interface StatsWordMetricsProps {
  wordStats: {
    overview: {
      total: number;
      recent: number;
      qualityScore: number;
    };
    quality: {
      withExamples: number;
      withImages: number;
      withoutExamples: number;
      withoutImages: number;
    };
    metrics: {
      averageSeenByLevel: Record<string, number>;
      averageSeenOverall: number;
    };
  };
}

export function StatsWordMetrics({ wordStats }: StatsWordMetricsProps) {
  const totalWords = wordStats.overview.total;
  const examplesPercentage = totalWords > 0 ? (wordStats.quality.withExamples / totalWords) * 100 : 0;
  const imagePercentage = totalWords > 0 ? (wordStats.quality.withImages / totalWords) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Promedio de Vistas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio de Vistas</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(wordStats.metrics.averageSeenOverall)}</div>
          <p className="text-xs text-muted-foreground">
            Veces vista promedio por palabra
          </p>
        </CardContent>
      </Card>

      {/* Con Ejemplos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Con Ejemplos</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wordStats.quality.withExamples}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={examplesPercentage} className="flex-1" />
            <span className="text-xs text-muted-foreground">{examplesPercentage.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Con Imágenes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Con Imágenes</CardTitle>
          <Image className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wordStats.quality.withImages}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={imagePercentage} className="flex-1" />
            <span className="text-xs text-muted-foreground">{imagePercentage.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Vistas por Nivel */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Promedio de Vistas por Dificultad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(wordStats.metrics.averageSeenByLevel).map(([level, seen]) => (
              <div key={level} className="flex items-center justify-between p-3 border rounded-lg">
                <Badge variant="outline" className={
                  level === 'easy' ? 'bg-green-100 text-green-800' :
                  level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Medio' : 'Difícil'}
                </Badge>
                <span className="font-medium">{Math.round(seen)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 