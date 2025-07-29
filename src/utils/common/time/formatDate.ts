import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formats a date string or Date object to Spanish format
 * 
 * @param date - The date to format (string or Date object)
 * @param formatString - Optional format string (default: "EEEE, d 'de' MMMM 'de' yyyy")
 * @returns Formatted date string in Spanish
 * 
 * @example
 * ```typescript
 * formatDateToSpanish("2024-01-15");
 * // Returns: "Lunes, 15 de enero de 2024"
 * 
 * formatDateToSpanish(new Date(), "d/M/yyyy");
 * // Returns: "15/1/2024"
 * ```
 */
export const formatDateToSpanish = (
  date: string | Date,
  formatString: string = "EEEE, d 'de' MMMM 'de' yyyy"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  try {
    const formattedDate = format(dateObj, formatString, {
      locale: es,
    });
    
    // Capitalize first letter
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha inválida";
  }
};

/**
 * Formats a date to a shorter Spanish format
 * 
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string in short Spanish format
 * 
 * @example
 * ```typescript
 * formatDateShort("2024-01-15");
 * // Returns: "15 ene 2024"
 * ```
 */
export const formatDateShort = (date: string | Date): string => {
  return formatDateToSpanish(date, "d MMM yyyy");
};

/**
 * Formats a date to show relative time (e.g., "hace 2 días")
 * 
 * @param date - The date to format (string or Date object)
 * @returns Relative time string in Spanish
 * 
 * @example
 * ```typescript
 * formatRelativeTime("2024-01-13");
 * // Returns: "hace 2 días"
 * ```
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "hoy";
  } else if (diffInDays === 1) {
    return "hace 1 día";
  } else if (diffInDays < 7) {
    return `hace ${diffInDays} días`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "hace 1 semana" : `hace ${weeks} semanas`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? "hace 1 año" : `hace ${years} años`;
  }
};

/**
 * Formats a date to show date and time in Spanish format
 * 
 * @param date - The date to format (string or Date object)
 * @returns Formatted date and time string in Spanish
 * 
 * @example
 * ```typescript
 * formatDateTimeSpanish("2024-01-15T21:32:17.808Z");
 * // Returns: "Lunes, 15 de enero de 2024 a las 9:32 PM"
 * ```
 */
export const formatDateTimeSpanish = (date: string | Date): string => {
  return formatDateToSpanish(date, "EEEE, d 'de' MMMM 'de' yyyy 'a las' h:mm a");
}; 