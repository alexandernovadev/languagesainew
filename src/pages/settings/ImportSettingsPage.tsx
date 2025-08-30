import { Card, CardContent } from "@/components/ui/card";
import LectureImportForm from "@/components/forms/LectureImportForm";
import WordImportForm from "@/components/forms/WordImportForm";
import ExpressionImportForm from "@/components/forms/ExpressionImportForm";
import UserImportForm from "@/components/forms/UserImportForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, Book, HelpCircle, Clock, MessageSquare, Users, Upload } from "lucide-react";

export default function ImportSettingsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Importación de Datos"
        description="Sube archivos JSON para importar tus datos de Lectures, Words o Questions."
      />
      <Card className="w-full">
        <CardContent className="space-y-6 pb-8 pt-2">
          <Tabs defaultValue="lectures" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="lectures">
                <Book className="h-4 w-4 mr-2" />
                Lectures
              </TabsTrigger>
              <TabsTrigger value="words">
                <FileText className="h-4 w-4 mr-2" />
                Words
              </TabsTrigger>
              <TabsTrigger value="expressions">
                <MessageSquare className="h-4 w-4 mr-2" />
                Expressions
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
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
            <TabsContent value="expressions">
              <div className="mb-3 text-lg font-semibold">
                Importar Expressions
              </div>
              <ExpressionImportForm />
            </TabsContent>
            <TabsContent value="users">
              <div className="mb-3 text-lg font-semibold">
                Importar Users
              </div>
              <UserImportForm />
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
