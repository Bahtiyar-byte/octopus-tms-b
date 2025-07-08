// User related types
export enum UserRole {
  OPERATOR = 'operator',
  DISPATCHER = 'dispatcher',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
  CARRIER = 'carrier',
  BROKER = 'broker',
  SHIPPER = 'shipper'
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  department?: string;
  prefersDarkMode?: boolean;
}

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

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  defaultView: string;
  refreshRate: number;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  startPage: string;
}
