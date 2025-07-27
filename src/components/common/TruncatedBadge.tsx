import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TruncatedBadgeProps {
  text: string;
  maxLength?: number;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  tooltipMaxWidth?: string;
}

export function TruncatedBadge({
  text,
  maxLength = 30,
  variant = "secondary",
  className = '',
  tooltipSide = 'top',
  tooltipMaxWidth = 'max-w-xs'
}: TruncatedBadgeProps) {
  const shouldTruncate = text.length > maxLength;
  const truncatedText = shouldTruncate ? text.substring(0, maxLength) + '...' : text;

  if (!shouldTruncate) {
    return (
      <Badge variant={variant} className={className}>
        {text}
      </Badge>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant={variant} 
          className={`max-w-full truncate cursor-default overflow-hidden ${className}`}
          style={{ maxWidth: '100%' }}
        >
          {truncatedText}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} className={tooltipMaxWidth}>
        <p className="text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
} 