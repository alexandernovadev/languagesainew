import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function ExpressionsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Expresiones" 
        description="Gestiona tus expresiones"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - ExpressionsPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de expresiones</p>
        </CardContent>
      </Card>
    </div>
  );
}
