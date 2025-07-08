// Driver Performance Mock Data

export interface DriverPerformance {
  name: string;
  miles: number;
  deliveries: number;
  rating: number;
  onTime: number;
}

export const generateDriverPerformance = (activePeriod: string): DriverPerformance[] => {
  const baseDrivers: DriverPerformance[] = [
    {
      name: 'John Smith',
      miles: 2450,
      deliveries: 12,
      rating: 4.8,
      onTime: 95
    },
    {
      name: 'Sarah Johnson',
      miles: 1890,
      deliveries: 8,
      rating: 4.6,
      onTime: 88
    },
    {
      name: 'Mike Rodriguez',
      miles: 3200,
      deliveries: 15,
      rating: 4.9,
      onTime: 97
    },
    {
      name: 'Lisa Davis',
      miles: 2100,
      deliveries: 10,
      rating: 4.5,
      onTime: 85
    },
    {
      name: 'David Wilson',
      miles: 2780,
      deliveries: 13,
      rating: 4.7,
      onTime: 92
    },
    {
      name: 'Jennifer Brown',
      miles: 1650,
      deliveries: 7,
      rating: 4.4,
      onTime: 78
    }
  ];

  // Adjust data based on selected period
  return baseDrivers.map(driver => {
    if (activePeriod === 'week') {
      return {
        ...driver,
        miles: Math.round(driver.miles * 5.5),
        deliveries: Math.round(driver.deliveries * 5),
        onTime: Math.min(100, Math.round(driver.onTime * 1.05))
      };
    } else if (activePeriod === 'month') {
      return {
        ...driver,
        miles: Math.round(driver.miles * 22),
        deliveries: Math.round(driver.deliveries * 20),
        onTime: Math.min(100, Math.round(driver.onTime * 1.1))
      };
    }
    return driver; // day view uses base data
  });
};