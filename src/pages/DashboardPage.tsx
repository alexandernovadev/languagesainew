import { PageLayout } from "@/components/layouts/page-layout";
import { StatisticsDashboard } from "@/components/statistics/StatisticsDashboard";
import RoutePreloader from "@/components/RoutePreloader";
import { useStatistics } from "@/hooks/useStatistics";

export default function DashboardPage() {
  const { stats, lectureStats, wordStats, loading, error, refetch } = useStatistics();

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
          refetch={refetch}
        />
      </PageLayout>
    </>
  );
}
