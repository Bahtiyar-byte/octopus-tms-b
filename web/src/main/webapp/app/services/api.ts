import { dashboardData } from '../data/dashboard';

// Simulated API service with artificial delay to mimic real API calls
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const api = {
  // Dashboard
  getDashboardData: () => simulateApiCall(dashboardData),
  getDashboardMetrics: () => simulateApiCall(dashboardData.metrics),
  getRevenuePerCustomer: () => simulateApiCall(dashboardData.revenuePerCustomer),
  getWeeklyLoadVolume: () => simulateApiCall(dashboardData.weeklyLoadVolume),
  getMonthlyTrends: () => simulateApiCall(dashboardData.monthlyTrends),
  getDriverPerformance: () => simulateApiCall(dashboardData.driverPerformance),
  getRecentActivity: () => simulateApiCall(dashboardData.recentActivity),
  getUpcomingDeliveries: () => simulateApiCall(dashboardData.upcomingDeliveries),
  getFuelPrices: () => simulateApiCall(dashboardData.fuelPrices),
  getWeatherAlerts: () => simulateApiCall(dashboardData.weatherAlerts),
};