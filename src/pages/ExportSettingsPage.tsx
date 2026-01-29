import { PageHeader } from "@/shared/components/ui/page-header";

export default function ExportSettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Exportar" 
        description="Exporta datos de la aplicación"
      />
      <div className="p-4">
        <p>Contenido de exportación</p>
      </div>
    </div>
  );
}
