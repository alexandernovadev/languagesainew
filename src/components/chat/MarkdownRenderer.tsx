import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { TextSelectionTooltip } from "@/components/common";

interface MarkdownRendererProps {
  content: string;
}

interface SelectionState {
  text: string;
  rect: DOMRect | null;
  isVisible: boolean;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [selection, setSelection] = useState<SelectionState>({
    text: "",
    rect: null,
    isVisible: false,
  });

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") {
      setSelection(prev => ({ ...prev, isVisible: false }));
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const text = selection.toString().trim();

    setSelection({
      text,
      rect,
      isVisible: true,
    });
  };

  const hideSelection = () => {
    setSelection(prev => ({ ...prev, isVisible: false }));
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const keepVisible = () => {
    // Mantener la selección visible por más tiempo
    setTimeout(() => {
      setSelection(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleTextSelection);
    return () => {
      document.removeEventListener('selectionchange', handleTextSelection);
    };
  }, []);

  return (
    <>
      <div className="text-selectable [&>*]:m-0 [&>*]:p-0" onMouseUp={handleTextSelection}>
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-green-400 font-bold text-2xl mb-3 border-b border-green-400/20 pb-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-green-400 font-bold text-xl mb-2.5 border-b border-green-400/20 pb-1.5" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-green-400 font-bold text-lg mb-2" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-green-400 font-bold text-base mb-1.5" {...props} />
            ),
            h5: ({ node, ...props }) => (
              <h5 className="text-green-400 font-bold text-sm mb-1" {...props} />
            ),
            h6: ({ node, ...props }) => (
              <h6 className="text-green-400 font-bold text-xs mb-1" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="leading-relaxed text-gray-100 mb-3 [&>*]:text-gray-100 [&>*]:leading-relaxed [&>strong]:text-green-300 [&>em]:text-blue-300 [&>code]:bg-gray-800/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:border [&>code]:border-gray-700 [&>a]:text-green-400 [&>a]:underline [&>a]:underline-offset-2 [&>a]:hover:text-green-300 [&>a]:transition-colors" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-none space-y-1.5 pl-0 mb-3 [&>li]:mb-1 [&>li>*]:text-gray-100 [&>li>strong]:text-green-300 [&>li>em]:text-blue-300 [&>li>code]:bg-gray-800/50 [&>li>code]:px-1.5 [&>li>code]:py-0.5 [&>li>code]:rounded [&>li>code]:text-sm [&>li>code]:font-mono [&>li>code]:border [&>li>code]:border-gray-700" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-none space-y-1.5 pl-0 mb-3 [&>li]:mb-1 [&>li>*]:text-gray-100 [&>li>strong]:text-green-300 [&>li>em]:text-blue-300 [&>li>code]:bg-gray-800/50 [&>li>code]:px-1.5 [&>li>code]:py-0.5 [&>li>code]:rounded [&>li>code]:text-sm [&>li>code]:font-mono [&>li>code]:border [&>li>code]:border-gray-700" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-green-400 before:content-[''] [&>*]:text-gray-100 [&>strong]:text-green-300 [&>em]:text-blue-300 [&>code]:bg-gray-800/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:border [&>code]:border-gray-700" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-bold" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code className="bg-gray-800/50 px-2 py-1 rounded-md text-sm font-mono text-green-300 border border-gray-700" {...props} />
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-gray-800/80 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-gray-700 shadow-lg" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-green-400 pl-4 italic text-gray-200 bg-gray-800/30 py-2 rounded-r-lg" {...props} />
            ),
            hr: ({ node, ...props }) => (
              <hr className="border-gray-600 my-4 opacity-50" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Tooltip de selección de texto */}
      <TextSelectionTooltip
        text={selection.text}
        rect={selection.rect}
        isVisible={selection.isVisible}
        onHide={hideSelection}
        onKeepVisible={keepVisible}
      />
    </>
  );
}
