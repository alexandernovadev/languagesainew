import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExamOptionCardProps } from "./types/examTypes";

export const ExamOptionCard: React.FC<ExamOptionCardProps> = ({
  value,
  label,
  isCorrect,
  hoverClass,
  circleColor,
  badgeText = "Correcta",
}) => (
  <div
    className={`flex items-center p-3 rounded-lg border transition-all duration-150 ${
      isCorrect
        ? "bg-green-500/10 border-green-500/20"
        : "bg-muted/50 border-border"
    } ${hoverClass}`}
  >
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
        isCorrect ? "bg-green-500" : circleColor
      } text-white`}
    >
      {value}
    </div>
    <span className={isCorrect ? "font-medium" : ""}>{label}</span>
    {isCorrect && (
      <Badge variant="default" className="ml-auto">
        {badgeText}
      </Badge>
    )}
  </div>
);
