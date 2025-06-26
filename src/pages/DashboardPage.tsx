import { PageLayout } from "@/components/layouts/page-layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  Bell,
  MessageSquare,
  Star,
  Heart
} from "lucide-react";
import RoutePreloader from "@/components/RoutePreloader";

export default function DashboardPage() {
  const showDefaultToast = () => {
    console.log("🔍 Intentando mostrar toast...");
    try {
      toast("Notificación", {
        description: "Esta es una notificación por defecto",
      });
      console.log("✅ Toast llamado exitosamente");
    } catch (error) {
      console.error("❌ Error al mostrar toast:", error);
    }
  };

  const showSuccessToast = () => {
    console.log("🔍 Intentando mostrar toast de éxito...");
    try {
      toast.success("¡Éxito!", {
        description: "La operación se completó correctamente",
      });
      console.log("✅ Toast de éxito llamado exitosamente");
    } catch (error) {
      console.error("❌ Error al mostrar toast de éxito:", error);
    }
  };

  const showErrorToast = () => {
    console.log("🔍 Intentando mostrar toast de error...");
    try {
      toast.error("Error", {
        description: "Algo salió mal. Por favor, inténtalo de nuevo.",
      });
      console.log("✅ Toast de error llamado exitosamente");
    } catch (error) {
      console.error("❌ Error al mostrar toast de error:", error);
    }
  };

  const showInfoToast = () => {
    toast.info("Información", {
      description: "Aquí tienes información importante para ti",
    });
  };

  const showWarningToast = () => {
    toast.warning("Advertencia", {
      description: "Ten cuidado con esta acción",
    });
  };

  const showLongToast = () => {
    toast("Notificación Larga", {
      description: "Esta es una notificación con un mensaje más largo para demostrar cómo se ve cuando el contenido es extenso y necesita más espacio en la pantalla.",
    });
  };

  const showToastWithAction = () => {
    toast("Acción Requerida", {
      description: "¿Quieres continuar con esta acción?",
      action: {
        label: "Continuar",
        onClick: () => console.log("Action clicked"),
      },
    });
  };

  const showToastWithIcon = () => {
    toast("Mensaje Especial", {
      description: "Este toast tiene un ícono personalizado",
    });
  };

  // Debug: Verificar si toast está disponible
  console.log("🔍 Dashboard renderizado, toast function:", typeof toast);

  return (
    <>
      <RoutePreloader />
      <PageLayout>
        <PageHeader
          title="Dashboard"
          description="Bienvenido a tu panel de control"
        />
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Demostración de Toasts
              </CardTitle>
              <CardDescription>
                Prueba las diferentes variantes de toast disponibles en la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="default" 
                  onClick={showDefaultToast}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Toast por Defecto
                </Button>

                <Button 
                  variant="default" 
                  onClick={showSuccessToast}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Toast de Éxito
                </Button>

                <Button 
                  variant="destructive" 
                  onClick={showErrorToast}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Toast de Error
                </Button>

                <Button 
                  variant="outline" 
                  onClick={showInfoToast}
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  Toast de Información
                </Button>

                <Button 
                  variant="outline" 
                  onClick={showWarningToast}
                  className="flex items-center gap-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  Toast de Advertencia
                </Button>

                <Button 
                  variant="secondary" 
                  onClick={showLongToast}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Toast Largo
                </Button>

                <Button 
                  variant="outline" 
                  onClick={showToastWithAction}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Toast con Acción
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={showToastWithIcon}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Toast Especial
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variantes de Toast Disponibles</CardTitle>
              <CardDescription>
                Lista de todas las variantes de toast que puedes usar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Default</h4>
                    <p className="text-sm text-muted-foreground">
                      Toast estándar con fondo y borde normales
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg border-red-200">
                    <h4 className="font-semibold mb-2 text-red-800">Destructive</h4>
                    <p className="text-sm text-red-600">
                      Toast para errores y acciones destructivas
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Características</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Auto-dismiss después de 5 segundos</li>
                    <li>• Posicionamiento en la esquina superior derecha</li>
                    <li>• Animaciones suaves de entrada y salida</li>
                    <li>• Soporte para acciones personalizadas</li>
                    <li>• Responsive en dispositivos móviles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </>
  );
}
