/**
 * Common type definitions used across the application
 */

// Paginated response
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export class ApplicationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationErrors = Record<string, string>;

// Generic form state
export interface FormState<T> {
  values: T;
  errors: ValidationErrors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Action types for reducers
export interface Action<T = string, P = unknown> {
  type: T;
  payload?: P;
}

// Async state management
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// UI component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Table column definition
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

// Sort and filter types
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'between';
  value: unknown;
}

// Date range
export interface DateRange {
  from: Date | string;
  to: Date | string;
}

// Address type
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

// Contact information
export interface ContactInfo {
  name: string;
  phone?: string;
  email?: string;
  title?: string;
}

// Generic ID type for entities
export type EntityId = string;

// Status types that can be extended
export type Status = 'active' | 'inactive' | 'pending';

// Common document type
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
}

// Notification types
export type NotificationType = 
  | 'location_update' 
  | 'delay_alert' 
  | 'status_change' 
  | 'weather_alert' 
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

// Weather alert type
export interface WeatherAlert {
  id?: string;
  severity?: 'info' | 'warning' | 'severe';
  title?: string;
  description?: string;
  affectedRoutes?: string[];
  startTime?: string;
  endTime?: string;
  // Properties used in data/alerts.ts
  region: string;
  alert: string;
  impact: string;
  affectedLoads: number;
}

// Company information
export interface Company {
  id: string;
  name: string;
  type: 'broker' | 'carrier' | 'shipper';
  mcNumber?: string;
  dotNumber?: string;
  ein?: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}