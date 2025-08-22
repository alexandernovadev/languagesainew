import { ReactNode, useState } from "react";
import { Button } from "./button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface ActionButton {
  id: string;
  icon: ReactNode;
  onClick: () => void;
  tooltip: string;
  variant?: "default" | "outline" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  badge?: {
    count?: number;
    text?: string;
    variant?: "default" | "secondary";
  };
  detailedTooltip?: ReactNode;
}

interface ActionButtonsHeaderProps {
  actions: ActionButton[];
  className?: string;
}

export function ActionButtonsHeader({ actions, className = "" }: ActionButtonsHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-1">
        {actions.map((action) => (
          <TooltipProvider key={action.id} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className="h-8 w-8 p-0 relative"
                >
                  {action.icon}
                  {action.badge && (action.badge.count || action.badge.text) && (
                    <span className={`absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center rounded-full ${
                      action.badge.variant === "default" 
                        ? "bg-green-600 text-white" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {action.badge.count || action.badge.text}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="z-[9999] relative">
                {action.detailedTooltip || <p>{action.tooltip}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      {/* Mobile Actions Menu */}
      <div className="sm:hidden">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
                          <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {actions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => {
                  action.onClick();
                  setIsMenuOpen(false);
                }}
                disabled={action.disabled || action.loading}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="flex items-center justify-center w-5 h-5">
                  {action.icon}
                </div>
                <span className="flex-1">{action.tooltip}</span>
                {action.badge && (action.badge.count || action.badge.text) && (
                  <span className={`ml-auto px-1.5 py-0.5 text-[10px] rounded-full ${
                    action.badge.variant === "default" 
                      ? "bg-green-600 text-white" 
                      : "bg-secondary text-secondary-foreground"
                  }`}>
                    {action.badge.count || action.badge.text}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
