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
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <CardTitle className="text-base sm:text-lg truncate">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay datos disponibles
          </p>
        ) : (
          items.map((item) => {
            const percentage = calculatedTotal > 0 ? (item.value / calculatedTotal) * 100 : 0;
            return (
              <div key={item.label} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                    <div className={cn("h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0", item.color)} />
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span className="font-semibold whitespace-nowrap">{item.value}</span>
                    {showPercentage && (
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        ({percentage.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={percentage} className="h-1.5 sm:h-2" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
