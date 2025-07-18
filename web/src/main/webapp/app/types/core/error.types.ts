/**
 * Error handling type definitions
 */

import { AxiosError } from 'axios';

// Server error response structure
export interface ServerErrorResponse {
  status: number;
  message?: string;
  fieldErrors?: Record<string, string>;
  code?: string;
  timestamp?: string;
  path?: string;
}

// Extended Axios error with typed response
export type ApiAxiosError = AxiosError<ServerErrorResponse>;

// Form field errors
export type FieldErrors = Record<string, string>;

// Error handler function type
export type ErrorHandler = (error: unknown) => void;