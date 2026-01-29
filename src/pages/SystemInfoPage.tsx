import { PageHeader } from "@/shared/components/ui/page-header";

export default function SystemInfoPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Información del Sistema" 
        description="Información sobre el sistema"
      />
      <div className="p-4">
        <p>Contenido de información del sistema</p>
      </div>
    </div>
  );
}
