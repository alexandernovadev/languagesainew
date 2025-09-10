import { MarkdownRenderer } from "./MarkdownRenderer";
import { TypingAnimation } from "@/shared/components/common/TypingAnimation";

interface StreamingMessageProps {
  streamingMessage: string;
  enableMarkdown?: boolean;
}

export function StreamingMessage({ streamingMessage, enableMarkdown = false }: StreamingMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="w-full p-3 rounded-lg bg-muted/30">
        {streamingMessage ? (
          <div className="text-sm max-w-none whitespace-pre-wrap">
            {enableMarkdown ? (
              <MarkdownRenderer content={streamingMessage} />
            ) : (
              <div className="whitespace-pre-wrap">{streamingMessage}</div>
            )}
          </div>
        ) : (
          <TypingAnimation />
        )}
      </div>
    </div>
  );
}
