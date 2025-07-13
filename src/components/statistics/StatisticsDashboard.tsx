import { useStatistics } from "@/hooks/useStatistics";
import { StatsKPIs } from "./StatsKPIs";
import { StatsLevelChart } from "./StatsLevelChart";
import { StatsQualityChart } from "./StatsQualityChart";
import { StatsLanguageChart } from "./StatsLanguageChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";

export function StatisticsDashboard() {
  const { stats, loading, error, refetch } = useStatistics();

  if (loading) {
    return (
      <div className="space-y-6">
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
        <RefreshCw className="h-4 w-4" />
        <AlertDescription>
          {error || "Error al cargar las estadísticas"}
        </AlertDescription>
      </Alert>
    );
  }

  // Validar que stats tenga la estructura esperada
  if (!stats.overview || !stats.overview.totalContent) {
    console.error("Invalid stats structure:", stats);
    return (
      <Alert>
        <RefreshCw className="h-4 w-4" />
        <AlertDescription>
          Estructura de datos inválida
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Estadísticas generales de tu contenido de aprendizaje
          </p>
        </div>
      </div>

      <StatsKPIs stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <StatsLevelChart stats={stats} />
        <StatsLanguageChart stats={stats} />
      </div>

      <StatsQualityChart stats={stats} />
    </div>
  );
} 