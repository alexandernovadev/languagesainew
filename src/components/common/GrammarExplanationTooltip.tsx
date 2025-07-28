import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface GrammarExplanationTooltipProps {
  explanation?: string;
  children?: React.ReactNode;
  className?: string;
}

export const GrammarExplanationTooltip: React.FC<
  GrammarExplanationTooltipProps
> = ({ explanation, children, className = "" }) => {
  if (!explanation) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 ${className}`}>
            {children}
            <HelpCircle className="h-4 w-4 text-blue-500 hover:text-blue-600 cursor-help transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-md p-0 bg-gray-900 border-gray-700"
          sideOffset={5}
        >
          <div
            className="p-3 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: explanation }}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
