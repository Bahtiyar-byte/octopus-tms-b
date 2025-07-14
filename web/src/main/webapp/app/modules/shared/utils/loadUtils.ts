// Load-specific utilities shared across all modules

export type LoadStatus = 
  | 'available'
  | 'assigned'
  | 'dispatched'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled';

// Load ID formatting
export const formatLoadId = (id: string | number): string => {
  return `LD-${id.toString().padStart(6, '0')}`;
};

// Load status formatting
export const formatLoadStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Load status colors (Tailwind classes)
export const getLoadStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    assigned: 'bg-blue-100 text-blue-800',
    dispatched: 'bg-purple-100 text-purple-800',
    picked_up: 'bg-indigo-100 text-indigo-800',
    in_transit: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-gray-100 text-gray-800',
    completed: 'bg-gray-500 text-white',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Load status icons
export const getLoadStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    available: 'circle-check',
    assigned: 'user-check',
    dispatched: 'truck',
    picked_up: 'package-check',
    in_transit: 'truck-moving',
    delivered: 'package-delivered',
    completed: 'check-double',
    cancelled: 'circle-x'
  };
  return icons[status.toLowerCase()] || 'circle';
};

// Validate load ID format
export const validateLoadId = (loadId: string): boolean => {
  return /^LD-\d{6}$/.test(loadId);
};

// Generate load reference
export const generateLoadReference = (loadId: string, date?: Date): string => {
  const dateStr = (date || new Date()).toISOString().split('T')[0].replace(/-/g, '');
  return `${loadId}-${dateStr}`;
};

// Calculate load progress percentage
export const calculateLoadProgress = (status: LoadStatus): number => {
  const progressMap: Record<LoadStatus, number> = {
    available: 0,
    assigned: 20,
    dispatched: 40,
    picked_up: 60,
    in_transit: 80,
    delivered: 90,
    completed: 100,
    cancelled: 0
  };
  return progressMap[status] || 0;
};

// Get next valid status transitions
export const getNextStatusOptions = (currentStatus: LoadStatus): LoadStatus[] => {
  const transitions: Record<LoadStatus, LoadStatus[]> = {
    available: ['assigned', 'cancelled'],
    assigned: ['dispatched', 'cancelled'],
    dispatched: ['picked_up', 'cancelled'],
    picked_up: ['in_transit', 'cancelled'],
    in_transit: ['delivered', 'cancelled'],
    delivered: ['completed'],
    completed: [],
    cancelled: []
  };
  return transitions[currentStatus] || [];
};

// Format load type
export const formatLoadType = (type: string): string => {
  const types: Record<string, string> = {
    ftl: 'Full Truckload',
    ltl: 'Less Than Truckload',
    partial: 'Partial',
    expedited: 'Expedited'
  };
  return types[type.toLowerCase()] || type;
};

// Calculate transit time estimate
export const estimateTransitTime = (miles: number, type: 'standard' | 'expedited' = 'standard'): string => {
  const avgSpeed = type === 'expedited' ? 55 : 45; // mph
  const drivingHoursPerDay = 10;
  
  const totalHours = miles / avgSpeed;
  const days = Math.ceil(totalHours / drivingHoursPerDay);
  
  if (days === 1) return '1 day';
  return `${days} days`;
};