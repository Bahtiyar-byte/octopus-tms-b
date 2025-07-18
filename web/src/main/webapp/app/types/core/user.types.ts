/**
 * Core user type definitions
 * This is the single source of truth for all user-related types
 */

// User roles - using uppercase to match backend expectations
export enum UserRole {
  // Admin roles
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  
  // Operational roles
  DISPATCHER = 'DISPATCHER',
  DRIVER = 'DRIVER',
  OPERATOR = 'OPERATOR',
  
  // Business roles
  BROKER = 'BROKER',
  CARRIER = 'CARRIER',
  SHIPPER = 'SHIPPER',
  
  // Support roles
  ACCOUNTING = 'ACCOUNTING',
  SALES = 'SALES',
  SUPPORT = 'SUPPORT'
}

// User status
export type UserStatus = 'active' | 'inactive';

// Main User interface
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  
  // Optional fields
  avatarUrl?: string;
  phone?: string;
  department?: string;
  lastLogin?: string; // ISO date string
  status?: UserStatus;
  prefersDarkMode?: boolean;
  
  // Computed fields (for UI)
  initials?: string;
  avatarColor?: string;
}

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// User statistics
export interface UserStats {
  actionsToday: number;
  loadsDispatched: number;
  tasksCompleted: number;
  totalDriversManaged: number;
  activeDriversToday: number;
  performanceScore: number;
  totalCustomersServed: number;
  averageResponseTime: number;
}

// User preferences
export interface UserPreferences {
  notifications: NotificationPreferences;
  defaultView: string;
  refreshRate: number;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  startPage: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

// User management types
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserListResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}