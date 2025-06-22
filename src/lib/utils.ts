import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMarkdownTitle = (content: string): string | null => {
  if (!content) return null;

  const lines = content.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("# ")) {
      return line.trim().substring(2);
    }
  }

  return null;
};
