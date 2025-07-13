import { PageLayout } from "@/components/layouts/page-layout";
import { StatisticsDashboard } from "@/components/statistics/StatisticsDashboard";
import RoutePreloader from "@/components/RoutePreloader";

export default function DashboardPage() {
  return (
    <>
      <RoutePreloader />
      <PageLayout>
        <StatisticsDashboard />
      </PageLayout>
    </>
  );
}
