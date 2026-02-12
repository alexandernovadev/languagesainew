import { useMemo, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { quillModules } from "@/shared/components/quillModules";
import { cn } from "@/utils/common/classnames";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  height?: string;
}

export function QuillEditor({
  value,
  onChange,
  placeholder = "Escribe el contenido aquí...",
  disabled = false,
  className,
  height = "400px",
}: QuillEditorProps) {
  const modules = useMemo(() => quillModules, []);
  const editorRef = useRef<HTMLDivElement>(null);

  // Quill 2: "bullet" is a list type, not a format. Only "list" is valid.
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "link",
    "image",
  ];

  // Apply height styles
  useEffect(() => {
    if (editorRef.current) {
      const container = editorRef.current.querySelector(".ql-container") as HTMLElement;
      const editor = editorRef.current.querySelector(".ql-editor") as HTMLElement;
      
      if (container) {
        container.style.height = height;
        container.style.fontSize = "14px";
      }
      if (editor) {
        editor.style.minHeight = height;
      }
    }
  }, [height]);

  return (
    <div 
      ref={editorRef}
      className={cn("quill-editor-wrapper", className)}
      style={{
        minHeight: height,
      }}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
    </div>
  );
}
