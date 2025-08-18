import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TruncatedText } from "@/components/common/TruncatedText";
import { TooltipProvider } from "@/components/ui/tooltip";

const routeNameMapping: { [key: string]: string } = {
  "/dashboard": "Inicio",
  "/lectures": "Lecturas",
  "/my-words": "Mis Palabras",
  "/my-expressions": "Mis Expresiones",

  "/settings": "Configuración",
  "/generator": "Generador",
  "/games": "Juegos",
  "/lectures/:id": "Detalle de Lectura",
  "/games/anki": "Juego Anki",
  "/games/verbs": "Juego de Verbos",
  "/generator/lecture": "Generador de Lecturas",
  "/generator/exam": "Generador de Exámenes",
  "/exam-history": "Historial de Exámenes",
  "/questions": "Preguntas",
  "/exams": "Exámenes",
  "/exams/:examSlug/take": "Tomar Examen",
  "/profile": "Mi Perfil",
  "/settings/general": "Configuración General",
  "/settings/import": "Importar",
  "/settings/export": "Exportar",
  "/settings/cleaner": "Limpiador",
  "/settings/system": "Información del Sistema",
  "/settings/logs": "Registros",
  "/admin": "Admin",
  "/admin/users": "Usuarios",
  
  // Tools
  "/tools": "Tools",
  "/tools/translator": "Traductor",
};

// Rutas que no deberían ser clickeables (solo grupos de navegación)
const nonClickableRoutes = ["/admin", "/settings", "/generator", "/games", "/tools"];

export function DynamicBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  // Función para obtener el nombre del segmento
  const getSegmentName = (segment: string, index: number) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

    // Si es la ruta de tomar examen, intentar obtener el título del examen
    if (path.includes("/exams/") && path.includes("/take")) {
      // Por ahora, mostrar "Tomar Examen" - esto se puede mejorar para mostrar el título real
      return "Tomar Examen";
    }

    return routeNameMapping[path] || segment;
  };

  return (
    <TooltipProvider>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            const name = getSegmentName(segment, index);
            const isNonClickable = nonClickableRoutes.includes(path);

            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast || isNonClickable ? (
                    <BreadcrumbPage>
                      <TruncatedText
                        text={name}
                        maxLength={24}
                        className="cursor-default"
                      />
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={path}>
                        <TruncatedText
                          text={name}
                          maxLength={24}
                          className="cursor-pointer"
                        />
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </TooltipProvider>
  );
}
