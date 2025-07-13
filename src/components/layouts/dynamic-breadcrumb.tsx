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

const routeNameMapping: { [key: string]: string } = {
  "/dashboard": "Inicio",
  "/lectures": "Lecturas",
  "/my-words": "Mis Palabras",
  "/settings": "Configuración",
  "/lectures/:id": "Detalle de Lectura",
  "/games/anki": "Juego Anki",
  "/games/verbs": "Juego de Verbos",
  "/generator/lecture": "Generador de Lecturas",
  "/generator/exam": "Generador de Exámenes",
  "/exam-history": "Historial de Exámenes",
  "/questions": "Preguntas",
  "/exams": "Exámenes",
  "/profile": "Mi Perfil",
  "/settings/general": "Configuración General",
  "/settings/import": "Importar",
  "/settings/export": "Exportar",
  "/settings/cleaner": "Limpiador",
  "/settings/system": "Información del Sistema",
  "/settings/logs": "Registros",
};

export function DynamicBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  return (
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
          const name = routeNameMapping[path] || segment;

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={path}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
