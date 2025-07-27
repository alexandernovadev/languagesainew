import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Calculates the time elapsed since a given date and returns it in Spanish
 * 
 * @param date - The date to calculate time from (string or Date object)
 * @returns Formatted time string in Spanish (e.g., "hace 2 horas", "hace 3 días")
 * 
 * @example
 * ```typescript
 * timeAgo("2024-01-15T10:30:00Z");
 * // Returns: "hace 2 horas" (depending on current time)
 * ```
 */
export const timeAgo = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  try {
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: es,
    });
  } catch (error) {
    console.error("Error calculating time ago:", error);
    return "tiempo desconocido";
  }
}; 