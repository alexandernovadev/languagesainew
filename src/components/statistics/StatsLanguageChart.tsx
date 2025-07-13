import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface StatsLanguageChartProps {
  stats: {
    byLanguage: {
      lectures: Record<string, number>;
      words: Record<string, number>;
    };
  };
}

export function StatsLanguageChart({ stats }: StatsLanguageChartProps) {
  const languageData = Object.entries(stats.byLanguage.lectures).map(([language, count]) => ({
    language,
    lectures: count,
    words: stats.byLanguage.words[language] || 0,
  }));

  const config = {
    language: {
      label: "Idioma",
    },
    lectures: {
      label: "Lecturas",
      color: "hsl(var(--chart-1))",
    },
    words: {
      label: "Palabras",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenido por Idioma</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución de lecturas y palabras por idioma
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <BarChart data={languageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="language" />
            <YAxis />
            <Bar dataKey="lectures" fill="hsl(var(--chart-1))" name="Lecturas" />
            <Bar dataKey="words" fill="hsl(var(--chart-2))" name="Palabras" />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 