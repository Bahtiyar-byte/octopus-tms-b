// System Alerts and Weather Alerts Mock Data

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info';
  resolved: boolean;
}

export interface WeatherAlert {
  region: string;
  alert: string;
  impact: string;
  affectedLoads: number;
}

export const generateSystemAlerts = (activePeriod: string): SystemAlert[] => {
  const baseAlerts: SystemAlert[] = [
    {
      id: 'SA-001',
      title: 'API Integration Error',
      message: 'EDI connection with Customer #1352 failed, retrying in 5 minutes',
      timestamp: '2025-05-20T16:45:00Z',
      type: 'error' as const,
      resolved: false
    },
    {
      id: 'SA-002',
      title: 'Geofence Alert',
      message: 'Driver Michael Rodriguez entered unplanned location',
      timestamp: '2025-05-20T15:30:00Z',
      type: 'warning' as const,
      resolved: true
    },
    {
      id: 'SA-003',
      title: 'Detention Time Alert',
      message: 'Truck #1077 at customer site for 2+ hours beyond appointment',
      timestamp: '2025-05-20T14:15:00Z',
      type: 'warning' as const,
      resolved: false
    },
    {
      id: 'SA-004',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 2:00 AM ET, expect 30 min downtime',
      timestamp: '2025-05-20T13:00:00Z',
      type: 'info' as const,
      resolved: false
    }
  ];

  // Add more alerts for week and month views
  if (activePeriod === 'week' || activePeriod === 'month') {
    baseAlerts.push({
      id: 'SA-005',
      title: 'ELD Compliance Warning',
      message: 'Driver John Smith approaching HOS limit',
      timestamp: '2025-05-19T10:30:00Z',
      type: 'warning' as const,
      resolved: true
    });
  }

  // Add even more alerts for month view
  if (activePeriod === 'month') {
    baseAlerts.push({
      id: 'SA-006',
      title: 'System Update Completed',
      message: 'TMS software updated to version 4.2.1',
      timestamp: '2025-05-10T02:15:00Z',
      type: 'info' as const,
      resolved: true
    });
  }

  return baseAlerts;
};

export const getWeatherAlerts = (): WeatherAlert[] => {
  return [
    {
      region: 'Midwest',
      alert: 'Heavy Snow Warning',
      impact: 'High',
      affectedLoads: 12
    },
    {
      region: 'Southeast',
      alert: 'Severe Thunderstorms',
      impact: 'Medium',
      affectedLoads: 7
    },
    {
      region: 'West Coast',
      alert: 'High Winds Advisory',
      impact: 'Low',
      affectedLoads: 3
    }
  ];
};