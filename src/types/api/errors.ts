/**
 * API Error Types
 */

export interface ApiError {
  message: string;
  statusCode: number;
  data?: any;
}

export interface ValidationError extends ApiError {
  errors: Record<string, string[]>;
}
