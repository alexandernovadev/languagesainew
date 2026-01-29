import { PageHeader } from "@/shared/components/ui/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Dashboard" 
        description="Bienvenido a LanguagesAI"
      />
      <div className="p-4">
        <p>Contenido del dashboard</p>
      </div>
    </div>
  );
}
