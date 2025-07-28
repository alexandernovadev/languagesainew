import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { AlertTriangle, Wrench, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LogsSettingsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Registros del Sistema"
        description="Sistema de logs y monitoreo de la aplicación"
      />

      <div className="space-y-6">
        <Alert className="border-orange-600 bg-orange-950/20">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-orange-200">
            Esta funcionalidad está temporalmente en mantenimiento mientras
            implementamos un nuevo sistema de logs más avanzado.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-4 text-gray-400">
                <Wrench className="h-12 w-12" />
                <Clock className="h-12 w-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-100">
                  Sistema de Logs en Mantenimiento
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Estamos trabajando en una nueva versión del sistema de logs
                  que incluirá:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
                <div className="text-left space-y-2">
                  <h4 className="font-medium text-gray-100">
                    🚀 Nuevas Características
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Dashboard en tiempo real</li>
                    <li>• Alertas automáticas</li>
                    <li>• Filtros avanzados</li>
                    <li>• Exportación mejorada</li>
                  </ul>
                </div>

                <div className="text-left space-y-2">
                  <h4 className="font-medium text-gray-100">
                    ⚡ Mejoras Técnicas
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Mejor rendimiento</li>
                    <li>• Interfaz más intuitiva</li>
                    <li>• Integración con monitoreo</li>
                    <li>• Análisis predictivo</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-950/20 rounded-lg border border-blue-800/50">
                <p className="text-sm text-blue-200">
                  <strong>¿Necesitas acceder a los logs?</strong> Por favor,
                  contacta al equipo de desarrollo o revisa la documentación
                  técnica para acceder directamente a los archivos de logs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
