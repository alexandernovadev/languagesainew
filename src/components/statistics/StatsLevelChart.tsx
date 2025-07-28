import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface StatsLevelChartProps {
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
    };
  };
}

export function StatsLevelChart({ stats }: StatsLevelChartProps) {
  const data = Object.entries(stats.byLevel.lectures).map(([level, count]) => ({
    level,
    count,
  }));

  const config = {
    level: {
      label: "Nivel",
    },
    count: {
      label: "Cantidad",
      color: "#6366f1", // Azul Tailwind
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Nivel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Lecturas disponibles por nivel de dificultad
        </p>
      </CardHeader>
      <CardContent className="w-full min-w-0 overflow-x-hidden">
        <ChartContainer config={config} className="h-[300px] w-full min-w-0">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" />
            <YAxis allowDecimals={false} />
            <Bar dataKey="count" fill="#6366f1" />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 