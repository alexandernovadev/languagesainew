import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function LecturesPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Lecturas" 
        description="Gestiona tus lecturas"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - LecturesPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de lecturas</p>
        </CardContent>
      </Card>
    </div>
  );
}
