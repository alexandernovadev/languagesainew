import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  label: string
  value: string | number
  suffix?: string
}

interface StatsGridProps {
  stats: StatItem[]
  className?: string
}

export function StatsGrid({ stats, className = "grid grid-cols-1 md:grid-cols-4 gap-4" }: StatsGridProps) {
  return (
    <div className={className}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {stat.value}
              {stat.suffix && <span className="text-sm font-normal ml-1">{stat.suffix}</span>}
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 