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
  "/generator/lecture": "Generador de Lecturas",
  "/profile": "Mi Perfil",
  "/settings/import": "Importar",
  "/settings/export": "Exportar",
  "/settings/cleaner": "Limpiador",
  "/settings/system": "Información del Sistema",
  "/admin": "Admin",
  "/admin/users": "Usuarios",
  
  // Tools
  "/tools": "Tools",
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
