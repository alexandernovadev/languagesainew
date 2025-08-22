import { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
      <div className="flex items-center justify-between p-2">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight truncate">{title}</h1>
          {description && <div className="text-xs text-muted-foreground truncate">{description}</div>}
        </div>
        {actions && <div className="flex gap-1">{actions}</div>}
      </div>
    </div>
  );
}
