import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function LectureDetailPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Detalle de Lectura" 
        description="Detalles de la lectura"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - LectureDetailPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido del detalle</p>
        </CardContent>
      </Card>
    </div>
  );
}
