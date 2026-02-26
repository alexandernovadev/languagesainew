import { ReactNode } from "react";
import { cn } from "@/utils/common/classnames";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const VOCAB_SPAN =
  '<span class="font-bold text-yellow-500 dark:text-yellow-400">';

/** Wraps vocabulary words in HTML spans for markdown rendering (assistant messages). */
export function wrapVocabularyInHtml(
  content: string,
  words: string[]
): string {
  if (!words?.length) return content;
  const escaped = words.map((w) => escapeRegex(w));
  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  return content.replace(regex, (match) => `${VOCAB_SPAN}${match}</span>`);
}

/** Renders plain text with vocabulary words highlighted (user messages). */
export function renderPlainTextWithHighlights(
  content: string,
  words: string[],
  onWordClick?: (word: string) => void
): ReactNode {
  if (!words?.length) {
    return <span className="whitespace-pre-wrap break-words">{content}</span>;
  }
  const escaped = words.map((w) => escapeRegex(w));
  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  const parts = content.split(regex);
  const wordSet = new Set(words.map((w) => w.toLowerCase()));

  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((part, i) =>
        wordSet.has(part.toLowerCase()) ? (
          <strong
            key={i}
            role={onWordClick ? "button" : undefined}
            tabIndex={onWordClick ? 0 : undefined}
            onClick={(e) => {
              if (onWordClick) {
                e.stopPropagation();
                onWordClick(part);
              }
            }}
            onKeyDown={(e) => {
              if (onWordClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onWordClick(part);
              }
            }}
            className={cn(
              "font-bold text-yellow-500 dark:text-yellow-400",
              onWordClick && "cursor-pointer hover:underline"
            )}
          >
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  );
}
