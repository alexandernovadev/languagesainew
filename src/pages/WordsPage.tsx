import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function WordsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Palabras" 
        description="Gestiona tus palabras"
      />
      <Card>
        <CardHeader>
          <CardTitle>hola ruta aqui - WordsPage</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contenido de palabras</p>
        </CardContent>
      </Card>
    </div>
  );
}
