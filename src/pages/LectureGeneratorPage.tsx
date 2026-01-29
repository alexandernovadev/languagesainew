import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function LectureGeneratorPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Generador de Lecturas" 
        description="Genera lecturas personalizadas con IA"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - LectureGeneratorPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido del generador</p>
        </CardContent>
      </Card>
    </div>
  );
}
