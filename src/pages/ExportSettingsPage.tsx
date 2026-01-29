import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function ExportSettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Exportar" 
        description="Exporta datos de la aplicación"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - ExportSettingsPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de exportación</p>
        </CardContent>
      </Card>
    </div>
  );
}
