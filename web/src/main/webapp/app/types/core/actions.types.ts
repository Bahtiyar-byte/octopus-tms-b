/**
 * Action types for mock actions and API operations
 */

import { LoadStatus } from './load.types';

// Load action types
export interface CreateLoadData {
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  equipmentType: string;
  weight?: number;
  rate: number;
  commodity?: string;
  specialInstructions?: string;
  customerId?: string;
}

export interface EditLoadData extends Partial<CreateLoadData> {
  status?: LoadStatus;
}

// Report types
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  status?: string;
  type?: string;
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  defaultView?: string;
}