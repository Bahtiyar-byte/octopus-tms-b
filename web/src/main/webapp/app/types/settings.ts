// User types
export type UserStatus = 'active' | 'inactive';
export type UserRole = 'Admin' | 'Dispatcher' | 'Accountant' | 'Viewer';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
  initials: string;
  avatarColor: string;
}

// Role interface
export interface Role {
  id: string;
  name: UserRole;
  description: string;
  userCount: number;
  icon: string;
  iconBg: string;
}

// Integration types
export interface Integration {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  apiKey: string;
  icon: string;
  iconBg: string;
}

// Tab type
export type TabType = 'company' | 'users' | 'integrations' | 'notifications' | 'billing' | 'appearance' | 'backup' | 'logs';

// Notification types
export interface NotificationChannels {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface NotificationTypeSettings {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface NotificationTypes {
  locationUpdates: NotificationTypeSettings;
  delayAlerts: NotificationTypeSettings;
  statusChanges: NotificationTypeSettings;
  weatherAlerts: NotificationTypeSettings;
  systemNotifications: NotificationTypeSettings;
}

// Appearance settings
export interface AppearanceSettings {
  theme: string;
  sidebarPosition: string;
  navbarStyle: string;
  contentWidth: string;
  density: string;
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
  secondaryColor: string;
}

// Backup settings
export interface BackupSettings {
  autoBackupEnabled: boolean;
  frequency: string;
  retentionPeriod: string;
}

// Company information
export interface CompanyInfo {
  name: string;
  mcNumber: string;
  dotNumber: string;
  ein: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}