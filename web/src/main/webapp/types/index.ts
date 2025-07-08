// // Export all types from user.ts
// export * from '../app/types/user';
//
// // Dashboard Types
// export interface DashboardMetrics {
//   totalLoadsToday: number;
//   activeDrivers: number;
//   revenueThisWeek: number;
//   loadsDeliveredOnTime: number;
//   totalMiles: number;
//   fuelCost: number;
//   pendingInvoices: number;
//   customerSatisfaction: number;
// }
//
// export interface CustomerRevenue {
//   customer: string;
//   revenue: number;
//   color: string;
// }
//
// export interface WeeklyLoadVolume {
//   dates: string[];
//   counts: number[];
// }
//
// export interface MonthlyTrends {
//   months: string[];
//   revenue: number[];
//   expenses: number[];
//   loads: number[];
// }
//
// export interface DriverPerformance {
//   name: string;
//   miles: number;
//   deliveries: number;
//   rating: number;
//   onTime: number;
// }
//
// export interface LoadActivity {
//   load: string;
//   origin: string;
//   destination: string;
//   status: string;
//   date: string;
//   customer: string;
//   driver: string;
// }
//
// export interface UpcomingDelivery {
//   load: string;
//   destination: string;
//   eta: string;
//   status: string;
//   driver: string;
// }
//
// export interface FuelPrices {
//   regions: string[];
//   prices: number[];
// }
//
// export interface WeatherAlert {
//   region: string;
//   alert: string;
//   impact: string;
//   affectedLoads: number;
// }
//
// export interface DashboardData {
//   metrics: DashboardMetrics;
//   revenuePerCustomer: CustomerRevenue[];
//   weeklyLoadVolume: WeeklyLoadVolume;
//   monthlyTrends: MonthlyTrends;
//   driverPerformance: DriverPerformance[];
//   recentActivity: LoadActivity[];
//   upcomingDeliveries: UpcomingDelivery[];
//   fuelPrices: FuelPrices;
//   weatherAlerts: WeatherAlert[];
// }
//
// export enum UserRole {
//   ADMIN = 'ADMIN',
//   SUPERVISOR = 'SUPERVISOR',
//   DISPATCHER = 'DISPATCHER',
//   DRIVER = 'DRIVER',
//   ACCOUNTING = 'ACCOUNTING',
//   SALES = 'SALES',
//   SUPPORT = 'SUPPORT',
//   BROKER = 'BROKER',
//   CARRIER = 'CARRIER',
//   SHIPPER = 'SHIPPER'
// }
//
// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   role: UserRole;
//   avatar?: string;
// }
//
// export interface WeatherAlert {
//   id: string;
//   severity: 'info' | 'warning' | 'severe';
//   title: string;
//   description: string;
//   affected_routes?: string[];
//   start_time?: string;
//   end_time?: string;
// }
//
// export interface Load {
//   id: string;
//   loadNumber: string;
//   status: string;
//   origin: string;
//   destination: string;
//   pickupDate: string;
//   deliveryDate: string;
//   weight?: number;
//   miles?: number;
//   rate?: number;
//   carrier?: string;
//   driver?: string;
//   customer?: string;
// }