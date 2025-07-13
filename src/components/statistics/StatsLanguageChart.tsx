import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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
      color: "#6366f1",
    },
    words: {
      label: "Palabras",
      color: "#34d399",
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
      <CardContent className="w-full min-w-0">
        <ChartContainer config={config} className="h-[300px] w-full min-w-0">
          <BarChart data={languageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="language" />
            <YAxis />
            <Bar dataKey="lectures" fill="#6366f1" name="Lecturas" />
            <Bar dataKey="words" fill="#34d399" name="Palabras" />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 