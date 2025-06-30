import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNameMapping: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/lectures": "Lectures",
  "/my-words": "My Words",
  "/statistics": "Statistics",
  "/settings": "Settings",
  "/lectures/:id": "Lecture Detail",
  "/games/anki": "Anki Game",
  "/games/verbs": "Verbs Game",
  "/generator/lecture": "Lecture Generator",
  "/generator/exam": "Exam Generator",
  "/exam-history": "Historial de Exámenes",
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
            <Link to="/">Home</Link>
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
