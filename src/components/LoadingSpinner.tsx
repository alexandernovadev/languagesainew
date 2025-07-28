import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-32 w-32"
  };

  return (
            <div className={`flex items-center justify-center min-h-dvh ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner; 