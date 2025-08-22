import { PageLayout } from "@/components/layouts/page-layout";
import { StatisticsDashboard } from "@/components/statistics/StatisticsDashboard";
import RoutePreloader from "@/components/RoutePreloader";
import { useStatistics } from "@/hooks/useStatistics";
import { ActionButtonsHeader } from "@/components/ui/action-buttons-header";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { stats, lectureStats, wordStats, loading, error, refetch } = useStatistics();

  const actions = [
    {
      id: "refresh",
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: refetch,
      tooltip: "Actualizar estadísticas",
      variant: "outline" as const,
      disabled: loading,
      loading: loading,
    },
  ];

  return (
    <>
      <RoutePreloader />
      <PageLayout>
        <StatisticsDashboard 
          stats={stats}
          lectureStats={lectureStats}
          wordStats={wordStats}
          loading={loading}
          error={error}
          actions={actions}
        />
      </PageLayout>
    </>
  );
}
