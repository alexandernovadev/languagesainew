import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Headphones, Image, BookOpen } from "lucide-react";

interface StatsLectureMetricsProps {
  lectureStats: {
    overview: {
      total: number;
      recent: number;
      qualityScore: number;
    };
    quality: {
      withAudio: number;
      withImages: number;
      withoutAudio: number;
      withoutImages: number;
    };
    metrics: {
      averageTimeByLevel: Record<string, number>;
      averageTimeOverall: number;
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

export function StatsLectureMetrics({
  lectureStats,
}: StatsLectureMetricsProps) {
  const totalLectures = lectureStats.overview.total;
  const audioPercentage =
    totalLectures > 0
      ? (lectureStats.quality.withAudio / totalLectures) * 100
      : 0;
  const imagePercentage =
    totalLectures > 0
      ? (lectureStats.quality.withImages / totalLectures) * 100
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-x-hidden">
      {/* Tiempo Promedio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lectureStats.metrics.averageTimeOverall} min
          </div>
          <p className="text-xs text-muted-foreground">
            Tiempo promedio por lectura
          </p>
        </CardContent>
      </Card>

      {/* Calidad de Audio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Con Audio</CardTitle>
          <Headphones className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lectureStats.quality.withAudio}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={audioPercentage} className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {audioPercentage.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Calidad de Imágenes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Con Imágenes</CardTitle>
          <Image className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lectureStats.quality.withImages}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={imagePercentage} className="flex-1" />
            <span className="text-xs text-muted-foreground">
              {imagePercentage.toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tiempo por Nivel */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Tiempo Promedio por Nivel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(lectureStats.metrics.averageTimeByLevel).map(
              ([level, time]) => (
                <div
                  key={level}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <Badge variant={levelBadgeVariant[level] || "default"}>
                    {level}
                  </Badge>
                  <span className="font-medium">{time} min</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
