import { PageHeader } from "@/shared/components/ui/page-header";

export default function ImportSettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Importar" 
        description="Importa datos a la aplicación"
      />
      <div className="p-4">
        <p>Contenido de importación</p>
      </div>
    </div>
  );
}
