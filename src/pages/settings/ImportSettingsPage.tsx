import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LectureImportForm from "@/components/forms/LectureImportForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ImportSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Importación de Datos</CardTitle>
        <CardDescription>
          Importa palabras, lecturas o preguntas desde archivos JSON
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="lectures" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="lectures">Lectures</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          <TabsContent value="lectures">
            <div className="mb-2 font-semibold">Importar Lectures</div>
            <LectureImportForm />
          </TabsContent>
          <TabsContent value="words">
            <div className="mb-2 font-semibold">Importar Words</div>
            <LectureImportForm />
          </TabsContent>
          <TabsContent value="questions">
            <div className="mb-2 font-semibold">Importar Questions</div>
            <LectureImportForm />
          </TabsContent>
        </Tabs>
        <div className="text-xs text-muted-foreground mt-2">
          Selecciona archivos JSON para importar tus datos
        </div>
      </CardContent>
    </Card>
  );
} 