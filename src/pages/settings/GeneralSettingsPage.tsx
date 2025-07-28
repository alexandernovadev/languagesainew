import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";

export default function GeneralSettingsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Configuración General"
        description="Ajusta tus preferencias principales de la aplicación."
      />
      <Card className="w-full">
        <CardContent className="space-y-8 py-8">
          <section>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Notificaciones por Email</div>
                <div className="text-sm text-muted-foreground">
                  Recibe avisos importantes y novedades en tu correo
                  electrónico.
                </div>
              </div>
              <Switch />
            </div>
          </section>
          <Separator />
          <section>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Actualizaciones Automáticas</div>
                <div className="text-sm text-muted-foreground">
                  Instala nuevas versiones automáticamente para estar siempre al
                  día.
                </div>
              </div>
              <Switch />
            </div>
          </section>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
