import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function SystemInfoPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Información del Sistema" 
        description="Información sobre el sistema"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - SystemInfoPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de información del sistema</p>
        </CardContent>
      </Card>
    </div>
  );
}
