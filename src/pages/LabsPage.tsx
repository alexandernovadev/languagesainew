import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function LabsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Labs" 
        description="Funciones experimentales"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - LabsPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de labs</p>
        </CardContent>
      </Card>
    </div>
  );
}
