import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatsQualityChartProps {
  stats: {
    quality: {
      lecturesWithoutAudio: number;
      lecturesWithoutImages: number;
      wordsWithoutExamples: number;
      wordsWithoutImages: number;
      lectureQualityScore: number;
      wordQualityScore: number;
    };
  };
}

export function StatsQualityChart({ stats }: StatsQualityChartProps) {
  const qualityData = [
    { name: "Con Audio", value: 100 - stats.quality.lecturesWithoutAudio, fill: "#10b981" },
    { name: "Sin Audio", value: stats.quality.lecturesWithoutAudio, fill: "#ef4444" },
  ];

  const imageData = [
    { name: "Con Imágenes", value: 100 - stats.quality.lecturesWithoutImages, fill: "#3b82f6" },
    { name: "Sin Imágenes", value: stats.quality.lecturesWithoutImages, fill: "#f59e0b" },
  ];

  const config = {
    value: {
      label: "Porcentaje",
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calidad de Audio</CardTitle>
          <p className="text-sm text-muted-foreground">
            Porcentaje de lecturas con audio
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-[200px]">
            <PieChart>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {qualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calidad de Imágenes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Porcentaje de lecturas con imágenes
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-[200px]">
            <PieChart>
              <Pie
                data={imageData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {imageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
} 