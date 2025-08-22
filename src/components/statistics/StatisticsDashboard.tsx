import { StatsKPIs } from "./StatsKPIs";
import { StatsLevelChart } from "./StatsLevelChart";
import { StatsQualityChart } from "./StatsQualityChart";
import { StatsLanguageChart } from "./StatsLanguageChart";
import { StatsLevelDistribution } from "./StatsLevelDistribution";
import { StatsLectureMetrics } from "./StatsLectureMetrics";
import { StatsWordMetrics } from "./StatsWordMetrics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { ActionButtonsHeader } from "@/components/ui/action-buttons-header";

interface StatisticsDashboardProps {
  stats: any;
  lectureStats: any;
  wordStats: any;
  loading: boolean;
  error: string | null;
  actions: Array<{
    id: string;
    icon: React.ReactNode;
    onClick: () => void;
    tooltip: string;
    variant?: "default" | "outline" | "secondary";
    disabled?: boolean;
    loading?: boolean;
  }>;
}

export function StatisticsDashboard({
  stats,
  lectureStats,
  wordStats,
  loading,
  error,
  actions,
}: StatisticsDashboardProps) {
  if (loading) {
    return (
      <div className="space-y-6 overflow-x-hidden">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Alert>
        <AlertDescription>
          {error || "Error al cargar las estadísticas"}
        </AlertDescription>
      </Alert>
    );
  }

  // Validar que stats tenga la estructura esperada
  if (!stats?.overview || !stats?.overview.totalContent) {
    console.error("Invalid stats structure:", stats);
    return (
      <Alert>
        <AlertDescription>Estructura de datos inválida</AlertDescription>
      </Alert>
    );
  }

  // Validar que los stats detallados estén disponibles
  if (!lectureStats || !wordStats) {
    console.error("Missing detailed stats:", { lectureStats, wordStats });
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <PageHeader
        title="Dashboard"
        description="Estadísticas generales de tu contenido de aprendizaje"
        actions={<ActionButtonsHeader actions={actions} />}
      />

      <StatsKPIs stats={stats} />

      <StatsLevelDistribution stats={stats} />

      <div className="grid gap-4 md:grid-cols-2">
        <StatsLevelChart stats={stats} />
        <StatsLanguageChart stats={stats} />
      </div>

      <StatsQualityChart stats={stats} />

      {/* Métricas Detalladas de Lecturas */}
      {lectureStats && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Métricas Detalladas de Lecturas
          </h3>
          <StatsLectureMetrics lectureStats={lectureStats} />
        </div>
      )}

      {/* Métricas Detalladas de Palabras */}
      {wordStats && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Métricas Detalladas de Palabras
          </h3>
          <StatsWordMetrics wordStats={wordStats} />
        </div>
      )}
    </div>
  );
}
