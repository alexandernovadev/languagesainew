import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  tooltipMaxWidth?: string;
  children?: React.ReactNode;
}

export function TruncatedText({
  text,
  maxLength = 80,
  className = '',
  tooltipSide = 'top',
  tooltipMaxWidth = 'max-w-xs',
  children
}: TruncatedTextProps) {
  const shouldTruncate = text.length > maxLength;
  const truncatedText = shouldTruncate ? text.substring(0, maxLength) + '...' : text;

  if (!shouldTruncate) {
    return <span className={className}>{children || text}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`cursor-default ${className}`}>
          {children || truncatedText}
        </span>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} className={tooltipMaxWidth}>
        <p className="text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
} 