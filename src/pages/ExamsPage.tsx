import { PageHeader } from "@/shared/components/ui/page-header";

export default function ExamsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Exámenes"
        description="Lista de exámenes de gramática disponibles"
      />
      <p className="text-muted-foreground">Próximamente...</p>
    </div>
  );
}
