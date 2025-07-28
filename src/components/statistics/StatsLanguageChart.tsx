import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface StatsLanguageChartProps {
  stats: {
    byLanguage: {
      lectures: Record<string, number>;
    };
  };
}

export function StatsLanguageChart({ stats }: StatsLanguageChartProps) {
  const data = Object.entries(stats.byLanguage.lectures).map(
    ([language, count]) => ({
      language,
      count,
    })
  );

  const config = {
    language: {
      label: "Idioma",
    },
    count: {
      label: "Cantidad",
      color: "#10b981", // Verde Tailwind
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Idioma</CardTitle>
        <p className="text-sm text-muted-foreground">
          Lecturas disponibles por idioma
        </p>
      </CardHeader>
      <CardContent className="w-full min-w-0 overflow-x-hidden">
        <ChartContainer config={config} className="h-[300px] w-full min-w-0">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="language" />
            <YAxis allowDecimals={false} />
            <Bar dataKey="count" fill="#10b981" />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
