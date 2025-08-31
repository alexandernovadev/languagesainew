import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}
// TODO Esto es el centro de la chambonada de markdown CAMBIAR son 13 segun gpt
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="[&>*]:m-0 [&>*]:p-0 [&>*]:space-y-0 [&>*]:gap-0 [&>*]:leading-none [&>*]:mb-0 [&>*]:mt-0 [&>*]:py-0 [&>*]:pt-0 [&>*]:pb-0">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-green-400 font-bold text-2xl border-b border-green-400/20 pb-2 m-0 p-0"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-green-400 font-bold text-xl border-b border-green-400/20 pb-1.5 m-0 p-0"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-green-400 font-bold text-lg m-0 p-0"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-green-400 font-bold text-base m-0 p-0"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="text-green-400 font-bold text-sm m-0 p-0"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="text-green-400 font-bold text-xs m-0 p-0"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="leading-relaxed text-gray-100 m-0 p-0 [&>*]:text-gray-100 [&>*]:leading-relaxed [&>strong]:text-green-300 [&>em]:text-blue-300 [&>code]:bg-gray-800/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:border [&>code]:border-gray-700 [&>a]:text-green-400 [&>a]:underline [&>a]:underline-offset-2 [&>a]:hover:text-green-300 [&>a]:transition-colors"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-6 m-0 p-0 marker:text-green-400 [&>li]:m-0 [&>li]:p-0 [&>li>*]:text-gray-100 [&>li>strong]:text-green-300 [&>li>em]:text-blue-300 [&>li>code]:bg-gray-800/50 [&>li>code]:px-1.5 [&>li>code]:py-0.5 [&>li>code]:rounded [&>li>code]:text-sm [&>li>code]:font-mono [&>li>code]:border [&>li>code]:border-gray-700"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-6 m-0 p-0 marker:text-green-400 [&>li]:m-0 [&>li]:p-0 [&>li>*]:text-gray-100 [&>li>strong]:text-green-300 [&>li>em]:text-blue-300 [&>li>code]:bg-gray-800/50 [&>li>code]:px-1.5 [&>li>code]:py-0.5 [&>li>code]:rounded [&>li>code]:text-sm [&>li>code]:font-mono [&>li>code]:border [&>li>code]:border-gray-700"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              className="pl-0 m-0 p-0 [&>*]:text-gray-100 [&>strong]:text-green-300 [&>em]:text-blue-300 [&>code]:bg-gray-800/50 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:border [&>code]:border-gray-700"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold m-0 p-0" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic m-0 p-0" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code
              className="bg-gray-800/50 px-2 py-1 rounded-md text-sm font-mono text-green-300 border border-gray-700 m-0"
              {...props}
            />
          ),
          pre: ({ node, ...props }) => (
            <pre
              className="bg-gray-800/80 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-gray-700 shadow-lg m-0"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-green-400 pl-4 italic text-gray-200 bg-gray-800/30 py-2 rounded-r-lg m-0 p-0"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-gray-600 opacity-50 m-0 p-0" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
