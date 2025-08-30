import { format } from "date-fns";
import { es } from "date-fns/locale";
import { capitalize } from "../string/capitalize";

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
    return capitalize(formattedDate);
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

/**
 * Formats a date to show only the local time (e.g., "10:30 AM")
 * 
 * @param date - The date to format (string or Date object)
 * @returns Formatted time string (e.g., "10:30 AM")
 */
export const formatLocalTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
/**
 * Formats a date to Spanish with 12h time and seconds for Bogotá timezone
 * Output example: "Domingo, 17 de agosto de 2025 | 02:15 34segs PM"
 */
export const formatDateSpanishBogotaWithTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  try {
    const timeZone = "America/Bogota";

    const dateFormatter = new Intl.DateTimeFormat("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone,
    });

    const timeFormatter = new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone,
    });

    const dateParts = dateFormatter.formatToParts(dateObj);
    const weekday = (dateParts.find(p => p.type === "weekday")?.value || "")
      .replace(/^./, c => c.toUpperCase());
    const day = dateParts.find(p => p.type === "day")?.value || "";
    const month = dateParts.find(p => p.type === "month")?.value || "";
    const year = dateParts.find(p => p.type === "year")?.value || "";

    const timeParts = timeFormatter.formatToParts(dateObj);
    const hour = timeParts.find(p => p.type === "hour")?.value || "";
    const minute = timeParts.find(p => p.type === "minute")?.value || "";
    const second = timeParts.find(p => p.type === "second")?.value || "";
    const dayPeriodRaw = timeParts.find(p => p.type === "dayPeriod")?.value || "";
    const dayPeriod = dayPeriodRaw.toLowerCase().startsWith("p") ? "PM" : "AM";
    const millis = dateObj.getMilliseconds();
    const centis = String(Math.floor(millis / 10)).padStart(2, "0");

    const dateText = `${weekday}, ${day} de ${month} de ${year}`;
    const timeText = `${hour}:${minute}::${second}:${centis} ${dayPeriod}`;
    return `${dateText} | ${timeText}`;
  } catch (error) {
    console.error("Error formatting Bogotá date/time:", error);
    return formatDateToSpanish(dateObj);
  }
};