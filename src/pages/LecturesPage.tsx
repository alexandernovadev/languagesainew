import { PageHeader } from "@/shared/components/ui/page-header";

export default function LecturesPage() {
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Lecturas" 
        description="Gestiona tus lecturas"
      />
      <div className="p-4">
        <p>Contenido de lecturas</p>
      </div>
    </div>
  );
}
