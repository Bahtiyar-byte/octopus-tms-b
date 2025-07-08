export const dashboardData = {
  metrics: {
    totalLoadsToday: 42,
    activeDrivers: 18,
    revenueThisWeek: 78500,
    loadsDeliveredOnTime: 38,
    totalMiles: 24680,
    fuelCost: 12450,
    pendingInvoices: 15,
    customerSatisfaction: 92
  },
  revenuePerCustomer: [
    { customer: "Acme Co", revenue: 22500, color: "#3498db" },
    { customer: "Global Logistics", revenue: 18700, color: "#2ecc71" },
    { customer: "Fast Freight", revenue: 25300, color: "#f39c12" },
    { customer: "Speedy Shipping", revenue: 12000, color: "#e74c3c" },
    { customer: "Reliable Transport", revenue: 16800, color: "#9b59b6" },
    { customer: "Prime Delivery", revenue: 19200, color: "#1abc9c" }
  ],
  weeklyLoadVolume: {
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    counts: [12, 18, 15, 22, 28, 16, 14]
  },
  monthlyTrends: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    revenue: [45000, 52000, 49000, 58000, 62000, 68000, 72000, 75000, 70000, 78500, 0, 0],
    expenses: [32000, 35000, 33000, 37000, 39000, 42000, 45000, 47000, 44000, 48000, 0, 0],
    loads: [85, 92, 88, 98, 105, 112, 118, 125, 115, 130, 0, 0]
  },
  driverPerformance: [
    { name: "John Smith", miles: 3250, deliveries: 12, rating: 4.8, onTime: 95 },
    { name: "Maria Garcia", miles: 2980, deliveries: 10, rating: 4.9, onTime: 100 },
    { name: "Robert Johnson", miles: 3100, deliveries: 11, rating: 4.7, onTime: 90 },
    { name: "Sarah Williams", miles: 2850, deliveries: 9, rating: 4.8, onTime: 95 },
    { name: "David Brown", miles: 3400, deliveries: 13, rating: 4.6, onTime: 85 }
  ],
  recentActivity: [
    { load: "LD1001", origin: "New York, NY", destination: "Chicago, IL", status: "Booked", date: "2025-10-01", customer: "Acme Co", driver: "John Smith" },
    { load: "LD1002", origin: "Dallas, TX", destination: "Houston, TX", status: "Assigned", date: "2025-10-01", customer: "Global Logistics", driver: "Maria Garcia" },
    { load: "LD1003", origin: "Miami, FL", destination: "Atlanta, GA", status: "Picked Up", date: "2025-10-02", customer: "Fast Freight", driver: "Robert Johnson" },
    { load: "LD1004", origin: "Seattle, WA", destination: "Portland, OR", status: "Delivered", date: "2025-10-02", customer: "Speedy Shipping", driver: "Sarah Williams" },
    { load: "LD1005", origin: "Boston, MA", destination: "Philadelphia, PA", status: "Booked", date: "2025-10-03", customer: "Reliable Transport", driver: "" },
    { load: "LD1006", origin: "San Francisco, CA", destination: "Los Angeles, CA", status: "Assigned", date: "2025-10-03", customer: "Prime Delivery", driver: "David Brown" },
    { load: "LD1007", origin: "Denver, CO", destination: "Phoenix, AZ", status: "Picked Up", date: "2025-10-04", customer: "Acme Co", driver: "John Smith" },
    { load: "LD1008", origin: "Minneapolis, MN", destination: "Milwaukee, WI", status: "Delivered", date: "2025-10-04", customer: "Global Logistics", driver: "Maria Garcia" }
  ],
  upcomingDeliveries: [
    { load: "LD1003", destination: "Atlanta, GA", eta: "2025-10-05 14:30", status: "On Schedule", driver: "Robert Johnson" },
    { load: "LD1006", destination: "Los Angeles, CA", eta: "2025-10-06 09:15", status: "Delayed", driver: "David Brown" },
    { load: "LD1007", destination: "Phoenix, AZ", eta: "2025-10-05 18:45", status: "On Schedule", driver: "John Smith" }
  ],
  fuelPrices: {
    regions: ["Northeast", "Southeast", "Midwest", "Southwest", "West"],
    prices: [3.85, 3.65, 3.72, 3.58, 4.12]
  },
  weatherAlerts: [
    { region: "Northeast", alert: "Heavy Rain", impact: "Medium", affectedLoads: 3 },
    { region: "Midwest", alert: "Snow", impact: "High", affectedLoads: 5 }
  ]
};