import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

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
      color: "hsl(var(--chart-1))",
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
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" />
            <YAxis />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 