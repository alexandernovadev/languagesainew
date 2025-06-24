import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally join CSS class names together
 * 
 * This function combines clsx and tailwind-merge to provide a powerful
 * way to conditionally apply CSS classes while properly handling
 * Tailwind CSS class conflicts and duplicates.
 * 
 * @param inputs - CSS class names, objects, arrays, or conditional expressions
 * @returns A string of concatenated and deduplicated CSS class names
 * 
 * @example
 * ```typescript
 * cn("px-2 py-1", "bg-red-500", "text-white")
 * // Returns: "px-2 py-1 bg-red-500 text-white"
 * ```
 * 
 * @example
 * ```typescript
 * cn("px-2 py-1", { "bg-red-500": isActive, "bg-gray-500": !isActive })
 * // Returns: "px-2 py-1 bg-red-500" if isActive is true
 * ```
 * 
 * @example
 * ```typescript
 * cn("px-2", "px-4") // Tailwind merge handles conflicting classes
 * // Returns: "px-4" (px-4 overrides px-2)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 