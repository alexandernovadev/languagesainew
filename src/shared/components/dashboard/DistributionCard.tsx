import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/utils/common/classnames";

interface DistributionItem {
  label: string;
  value: number;
  color?: string;
}

interface DistributionCardProps {
  title: string;
  icon: LucideIcon;
  data: Record<string, number>;
  colors?: Record<string, string>;
  total?: number;
  showPercentage?: boolean;
}

const defaultColors: Record<string, string> = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
  A1: "bg-blue-200",
  A2: "bg-blue-300",
  B1: "bg-blue-400",
  B2: "bg-blue-500",
  C1: "bg-blue-600",
  C2: "bg-blue-700",
};

export function DistributionCard({
  title,
  icon: Icon,
  data,
  colors = defaultColors,
  total,
  showPercentage = true,
}: DistributionCardProps) {
  const items: DistributionItem[] = Object.entries(data)
    .map(([label, value]) => ({
      label,
      value,
      color: colors[label] || "bg-primary",
    }))
    .sort((a, b) => b.value - a.value);

  const calculatedTotal = total || items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay datos disponibles
          </p>
        ) : (
          items.map((item) => {
            const percentage = calculatedTotal > 0 ? (item.value / calculatedTotal) * 100 : 0;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", item.color)} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.value}</span>
                    {showPercentage && (
                      <span className="text-muted-foreground">
                        ({percentage.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
