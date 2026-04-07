import { ReactNode } from "react";
import { SidebarTrigger } from "./sidebar";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
}

export function PageHeader({ title, description, actions, filters }: PageHeaderProps) {
  return (
    <div className="sticky top-[-0.1rem] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Title Section */}
      <div className="flex items-start py-1">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-xs sm:text-base md:text-xs">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Filters Section */}
      {filters && (
        <div className="mt-1 pb-2">
          {filters}
        </div>
      )}
    </div>
  );
}
