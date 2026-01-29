import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Dashboard" 
        description="Bienvenido a LanguagesAI"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - DashboardPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido del dashboard</p>
        </CardContent>
      </Card>
    </div>
  );
}
