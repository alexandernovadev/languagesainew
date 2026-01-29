import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function ImportSettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Importar" 
        description="Importa datos a la aplicación"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - ImportSettingsPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de importación</p>
        </CardContent>
      </Card>
    </div>
  );
}
