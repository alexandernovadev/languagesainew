import { Card, CardContent } from "@/components/ui/card";
import LectureImportForm from "@/components/forms/LectureImportForm";
import WordImportForm from "@/components/forms/WordImportForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";

export default function ImportSettingsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Importación de Datos"
        description="Sube archivos JSON para importar tus datos de Lectures, Words o Questions."
      />
      <Card className="w-full">
        <CardContent className="space-y-6 pb-8">
          <Tabs defaultValue="lectures" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="lectures">Lectures</TabsTrigger>
              <TabsTrigger value="words">Words</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="lectures">
              <div className="mb-3 text-lg font-semibold">
                Importar Lectures
              </div>
              <LectureImportForm />
            </TabsContent>
            <TabsContent value="words">
              <div className="mb-3 text-lg font-semibold">Importar Words</div>
              <WordImportForm />
            </TabsContent>
            <TabsContent value="questions">
              <div className="mb-3 text-lg font-semibold">
                Importar Questions
              </div>
              <LectureImportForm />
            </TabsContent>
          </Tabs>
          <Separator />
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Recuerda: solo se aceptan archivos en formato JSON válidos para cada
            tipo de dato.
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
