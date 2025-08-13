/**
 * Main types export file
 * Re-exports core types and adds application-specific types
 */

// Re-export all core types
export * from './core';
export { CompanyType } from './core/user.types';

// Legacy exports for backward compatibility - will be removed in future
// export * from './user'; // Temporarily disabled to fix module resolution issue

// Dashboard specific types
export interface DashboardMetrics {
  totalLoadsToday: number;
  activeDrivers: number;
  revenueThisWeek: number;
  loadsDeliveredOnTime: number;
  totalMiles: number;
  fuelCost: number;
  pendingInvoices: number;
  customerSatisfaction: number;
}

export interface CustomerRevenue {
  customer: string;
  revenue: number;
  color: string;
}

export interface WeeklyLoadVolume {
  dates: string[];
  counts: number[];
}

export interface MonthlyTrends {
  months: string[];
  revenue: number[];
  expenses: number[];
  loads: number[];
}

export interface DriverPerformance {
  name: string;
  miles: number;
  deliveries: number;
  rating: number;
  onTime: number;
}

export interface LoadActivity {
  load: string;
  origin: string;
  destination: string;
  status: string;
  date: string;
  customer: string;
  driver: string;
}

export interface UpcomingDelivery {
  load: string;
  destination: string;
  eta: string;
  status: string;
  driver: string;
}

export interface FuelPrices {
  regions: string[];
  prices: number[];
}

export interface DashboardData {
  metrics: DashboardMetrics;
  revenuePerCustomer: CustomerRevenue[];
  weeklyLoadVolume: WeeklyLoadVolume;
  monthlyTrends: MonthlyTrends;
  driverPerformance: DriverPerformance[];
  recentActivity: LoadActivity[];
  upcomingDeliveries: UpcomingDelivery[];
  fuelPrices: FuelPrices;
  weatherAlerts: any[]; // Using any temporarily - WeatherAlert is defined in core/common.types
}