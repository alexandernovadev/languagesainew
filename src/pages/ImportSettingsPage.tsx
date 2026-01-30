import { PageHeader } from "@/shared/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ImportTab } from "@/shared/components/import/ImportTab";

export default function ImportSettingsPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Importar Datos" 
        description="Importa palabras, expresiones y lecturas desde archivos JSON"
      />
      
      <Tabs defaultValue="words" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="words">Words</TabsTrigger>
          <TabsTrigger value="expressions">Expressions</TabsTrigger>
          <TabsTrigger value="lectures">Lectures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="words" className="mt-4">
          <ImportTab 
            type="words"
            title="Importar Palabras"
          />
        </TabsContent>
        
        <TabsContent value="expressions" className="mt-4">
          <ImportTab 
            type="expressions"
            title="Importar Expresiones"
          />
        </TabsContent>
        
        <TabsContent value="lectures" className="mt-4">
          <ImportTab 
            type="lectures"
            title="Importar Lecturas"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
