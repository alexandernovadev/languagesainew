// Central identity/domain constants and types

// Languages (re-export from language utils)
export {
  allowedLanguageCodes,
  type AllowedLanguageCode,
  getAllowedLanguages,
} from "@/utils/common/language";

// Roles
export type UserRole = "admin" | "teacher" | "student";
export const ALLOWED_USER_ROLES: readonly UserRole[] = [
  "admin",
  "teacher",
  "student",
] as const;
