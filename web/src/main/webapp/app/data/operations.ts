// Field Operations Mock Data

export interface FieldOperation {
  id: string;
  location: string;
  timestamp: string;
  driver: string;
  type: string;
  status: string;
  details: string;
  priority: 'high' | 'medium' | 'low';
}

export const generateFieldOperations = (activePeriod: string): FieldOperation[] => {
  const baseOperations: FieldOperation[] = [
    {
      id: 'FO-12345',
      location: 'Dallas, TX',
      timestamp: '2025-05-20T14:30:00Z',
      driver: 'Michael Rodriguez',
      type: 'Delivery Delay',
      status: 'In Progress',
      details: 'Customer requested late delivery window due to warehouse staffing',
      priority: 'medium' as const
    },
    {
      id: 'FO-12346',
      location: 'Chicago, IL',
      timestamp: '2025-05-20T15:15:00Z',
      driver: 'Sarah Johnson',
      type: 'Route Deviation',
      status: 'Requires Attention',
      details: 'Driver reported road closure, needs alternate route approval',
      priority: 'high' as const
    },
    {
      id: 'FO-12347',
      location: 'Atlanta, GA',
      timestamp: '2025-05-20T13:45:00Z',
      driver: 'David Chen',
      type: 'Equipment Issue',
      status: 'Resolved',
      details: 'Trailer brake light replaced by roadside service',
      priority: 'medium' as const
    },
    {
      id: 'FO-12348',
      location: 'Miami, FL',
      timestamp: '2025-05-20T16:00:00Z',
      driver: 'Emily Wilson',
      type: 'Customer Complaint',
      status: 'Needs Follow-up',
      details: 'Customer reported minor damage to two cartons',
      priority: 'high' as const
    },
    {
      id: 'FO-12349',
      location: 'Phoenix, AZ',
      timestamp: '2025-05-20T12:30:00Z',
      driver: 'Jose Martinez',
      type: 'Schedule Adjustment',
      status: 'Approved',
      details: 'Added pickup at secondary location',
      priority: 'low' as const
    }
  ];

  // Add more operations for week and month views
  if (activePeriod === 'week' || activePeriod === 'month') {
    baseOperations.push(
      {
        id: 'FO-12350',
        location: 'Boston, MA',
        timestamp: '2025-05-19T10:15:00Z',
        driver: 'Lisa Thompson',
        type: 'Weather Delay',
        status: 'Resolved',
        details: 'Heavy snow caused 3-hour delay in departure',
        priority: 'medium' as const
      },
      {
        id: 'FO-12351',
        location: 'Seattle, WA',
        timestamp: '2025-05-18T09:30:00Z',
        driver: 'Robert Johnson',
        type: 'Mechanical Issue',
        status: 'Resolved',
        details: 'Tire replacement completed by roadside service',
        priority: 'high' as const
      }
    );
  }

  // Add even more operations for month view
  if (activePeriod === 'month') {
    baseOperations.push(
      {
        id: 'FO-12352',
        location: 'Denver, CO',
        timestamp: '2025-05-10T11:45:00Z',
        driver: 'James Wilson',
        type: 'Customer Request',
        status: 'Approved',
        details: 'Customer requested specific delivery time window',
        priority: 'low' as const
      },
      {
        id: 'FO-12353',
        location: 'San Francisco, CA',
        timestamp: '2025-05-05T13:20:00Z',
        driver: 'Maria Garcia',
        type: 'Route Optimization',
        status: 'Completed',
        details: 'Route adjusted to accommodate multiple pickups',
        priority: 'medium' as const
      }
    );
  }

  return baseOperations;
};