import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface StatsKPIsProps {
  stats: {
    overview: {
      totalContent: {
        lectures: number;
        words: number;
      };
      contentQuality: {
        overallQualityScore: number;
      };
      recentActivity: {
        recentLectures: number;
        recentWords: number;
      };
    };
    engagement: {
      averageLectureTime: number;
      averageWordSeen: number;
    };
  };
}

export function StatsKPIs({ stats }: StatsKPIsProps) {
  // Validar que stats tenga la estructura esperada
  if (!stats?.overview?.totalContent || !stats?.engagement) {
    console.error("Stats structure is invalid:", stats);
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Lecturas Totales",
      value: stats.overview.totalContent.lectures || 0,
      change: "+12%",
      icon: BookOpen,
      color: "blue",
      trend: "up",
    },
    {
      title: "Palabras Totales",
      value: stats.overview.totalContent.words || 0,
      change: "+8%",
      icon: Brain,
      color: "green",
      trend: "up",
    },
    {
      title: "Tiempo Promedio",
      value: `${Math.round(stats.engagement.averageLectureTime || 0)} min`,
      change: "+15%",
      icon: Clock,
      color: "purple",
      trend: "up",
    },
    {
      title: "Calidad del Contenido",
      value: `${stats.overview.contentQuality?.overallQualityScore || 0}%`,
      change: "Excelente",
      icon: Target,
      color: "orange",
      trend: "stable",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {kpi.trend === "up" && (
                <TrendingUp className="h-3 w-3 text-green-500" />
              )}
              {kpi.trend === "stable" && (
                <CheckCircle className="h-3 w-3 text-blue-500" />
              )}
              {kpi.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
