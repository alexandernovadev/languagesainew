import { Button } from "./button";
import { Label } from "./label";
import React from "react";

interface FileInputButtonProps {
  accept?: string;
  onFileChange: (file: File | null) => void;
  label?: string;
  icon?: React.ReactNode;
  file?: File | null;
  error?: string | null;
  className?: string;
  inputId?: string;
  disabled?: boolean;
}

export const FileInputButton: React.FC<FileInputButtonProps> = ({
  accept = "*",
  onFileChange,
  label = "Seleccionar archivo",
  icon = "📄",
  file,
  error,
  className = "",
  inputId = "file-input-button",
  disabled = false,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onFileChange(selected);
  };

  return (
    <div className={`flex items-center space-x-3 mt-1 ${className}`}>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className="px-4 py-2"
        disabled={disabled}
      >
        {icon} {label}
      </Button>
      <span className={`text-sm ${file ? "text-foreground" : "text-muted-foreground"}`}>
        {file ? file.name : "Ningún archivo seleccionado"}
      </span>
      {error && (
        <div className="text-xs text-red-500 ml-2">{error}</div>
      )}
    </div>
  );
}; 