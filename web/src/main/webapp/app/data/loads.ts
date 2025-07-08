// Unified load status types - "New" is the initial status when shipper creates a load
export type LoadStatus = 'New' | 'Posted' | 'Assigned' | 'En Route' | 'Delivered' | 'Awaiting Docs' | 'POD Received' | 'Paid' | 'Closed';

// Shipper-specific statuses for their view
export type ShipperLoadStatus = 'New' | 'Draft' | 'Posted' | 'Carrier Assigned' | 'In Transit' | 'Delivered' | 'POD Received' | 'Closed';

// Base load interface
export interface Load {
  id: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  commodity: string;
  weight: string;
  rate: string;
  equipmentType: string;
  status: LoadStatus;
  carrier?: string;
  broker?: string;
  shipper?: string;
  reference?: string;
  specialInstructions?: string;
  createdBy: 'shipper' | 'broker';
  createdAt: string;
}

// Extended interface for shipper view
export interface ShipperLoad extends Load {
  reference: string;
  broker: string;
}

// Mock loads data - centralized for both broker and shipper
export const mockLoads: Load[] = [
  // New loads created by shipper (visible to selected broker)
  {
    id: 'SH-2152',
    origin: 'Cincinnati, OH',
    destination: 'Louisville, KY',
    pickupDate: '2025-06-19',
    deliveryDate: '2025-06-19',
    commodity: 'Manufacturing Equipment',
    weight: '35000',
    rate: '1200',
    equipmentType: 'Flatbed',
    status: 'New',
    broker: 'Shanahan Transportation Systems, Inc.',
    shipper: 'Acme Manufacturing',
    reference: 'PO-78950',
    specialInstructions: 'Forklift required for loading',
    createdBy: 'shipper',
    createdAt: '2025-06-03T10:30:00Z'
  },
  {
    id: 'SH-2153',
    origin: 'Toledo, OH',
    destination: 'Detroit, MI',
    pickupDate: '2025-06-20',
    deliveryDate: '2025-06-20',
    commodity: 'Automotive Parts',
    weight: '28000',
    rate: '950',
    equipmentType: 'Dry Van',
    status: 'New',
    broker: 'Express Freight Brokers',
    shipper: 'Auto Parts Direct',
    reference: 'PO-78951',
    createdBy: 'shipper',
    createdAt: '2025-06-03T11:15:00Z'
  },
  // Existing broker loads
  {
    id: 'BL-1234',
    origin: 'Chicago, IL',
    destination: 'Atlanta, GA',
    pickupDate: '2025-06-15',
    deliveryDate: '2025-06-17',
    commodity: 'Electronics',
    weight: '15000',
    rate: '2200',
    equipmentType: 'Dry Van',
    status: 'Assigned',
    carrier: 'FastFreight Inc.',
    broker: 'Shanahan Transportation Systems, Inc.',
    shipper: 'Tech Distributors Inc.',
    createdBy: 'broker',
    createdAt: '2025-06-01T08:00:00Z'
  },
  {
    id: 'BL-1235',
    origin: 'Dallas, TX',
    destination: 'Phoenix, AZ',
    pickupDate: '2025-06-16',
    deliveryDate: '2025-06-18',
    commodity: 'Auto Parts',
    weight: '22000',
    rate: '1800',
    equipmentType: 'Flatbed',
    status: 'En Route',
    carrier: 'Southwest Carriers',
    broker: 'National Logistics Corp',
    shipper: 'Auto Suppliers LLC',
    createdBy: 'broker',
    createdAt: '2025-06-01T09:00:00Z'
  },
  {
    id: 'BL-1236',
    origin: 'Miami, FL',
    destination: 'Charlotte, NC',
    pickupDate: '2025-06-17',
    deliveryDate: '2025-06-19',
    commodity: 'Retail Goods',
    weight: '18000',
    rate: '1950',
    equipmentType: 'Dry Van',
    status: 'Posted',
    broker: 'Express Freight Brokers',
    shipper: 'Retail Chain Distribution',
    createdBy: 'broker',
    createdAt: '2025-06-02T10:00:00Z'
  },
  {
    id: 'BL-1237',
    origin: 'Seattle, WA',
    destination: 'Portland, OR',
    pickupDate: '2025-06-14',
    deliveryDate: '2025-06-15',
    commodity: 'Produce',
    weight: '24000',
    rate: '1100',
    equipmentType: 'Reefer',
    status: 'Delivered',
    carrier: 'Pacific Transport',
    broker: 'West Coast Brokers',
    shipper: 'Fresh Farms Co.',
    createdBy: 'broker',
    createdAt: '2025-05-30T14:00:00Z'
  },
  {
    id: 'BL-1238',
    origin: 'Boston, MA',
    destination: 'New York, NY',
    pickupDate: '2025-06-13',
    deliveryDate: '2025-06-14',
    commodity: 'Medical Supplies',
    weight: '12000',
    rate: '950',
    equipmentType: 'Dry Van',
    status: 'Awaiting Docs',
    carrier: 'East Coast Logistics',
    broker: 'Northeast Logistics',
    shipper: 'Medical Supply Corp',
    createdBy: 'broker',
    createdAt: '2025-05-29T16:00:00Z'
  },
  {
    id: 'BL-1239',
    origin: 'Denver, CO',
    destination: 'Salt Lake City, UT',
    pickupDate: '2025-06-12',
    deliveryDate: '2025-06-13',
    commodity: 'Construction Materials',
    weight: '28000',
    rate: '1400',
    equipmentType: 'Flatbed',
    status: 'Paid',
    carrier: 'Mountain Haulers',
    broker: 'Regional Transport Services',
    shipper: 'Construction Supply Inc.',
    createdBy: 'broker',
    createdAt: '2025-05-28T12:00:00Z'
  },
  // Shipper created loads with various statuses
  {
    id: 'SH-2145',
    origin: 'Chicago, IL',
    destination: 'Atlanta, GA',
    pickupDate: '2025-06-15',
    deliveryDate: '2025-06-17',
    commodity: 'Aluminum Coils',
    weight: '42000',
    rate: '3200',
    equipmentType: 'Flatbed',
    status: 'Assigned',
    carrier: 'Shanahan Transportation',
    broker: 'Shanahan Transportation Systems, Inc.',
    shipper: 'Metal Works Inc.',
    reference: 'PO-78945',
    specialInstructions: 'Tarped load required',
    createdBy: 'shipper',
    createdAt: '2025-06-01T07:00:00Z'
  },
  {
    id: 'SH-2146',
    origin: 'Detroit, MI',
    destination: 'Houston, TX',
    pickupDate: '2025-06-16',
    deliveryDate: '2025-06-19',
    commodity: 'Auto Parts',
    weight: '38000',
    rate: '2950',
    equipmentType: 'Dry Van',
    status: 'En Route',
    carrier: 'Swift Logistics',
    broker: 'Express Freight Brokers',
    shipper: 'Auto Manufacturing Co.',
    reference: 'PO-78946',
    createdBy: 'shipper',
    createdAt: '2025-06-01T11:00:00Z'
  },
  {
    id: 'SH-2147',
    origin: 'Milwaukee, WI',
    destination: 'Nashville, TN',
    pickupDate: '2025-06-17',
    deliveryDate: '2025-06-19',
    commodity: 'Industrial Equipment',
    weight: '28000',
    rate: '2650',
    equipmentType: 'Flatbed',
    status: 'Posted',
    broker: 'Midwest Freight Solutions',
    shipper: 'Industrial Supply Corp',
    reference: 'PO-78947',
    createdBy: 'shipper',
    createdAt: '2025-06-02T09:00:00Z'
  }
];

// Helper function to get loads for a specific broker
export const getLoadsForBroker = (brokerName: string): Load[] => {
  return mockLoads.filter(load => load.broker === brokerName);
};

// Helper function to get loads for a specific shipper
export const getLoadsForShipper = (shipperName: string): Load[] => {
  return mockLoads.filter(load => load.shipper === shipperName);
};

// Helper function to map load status for shipper view
export const mapToShipperStatus = (status: LoadStatus): ShipperLoadStatus => {
  const statusMap: Partial<Record<LoadStatus, ShipperLoadStatus>> = {
    'New': 'New',
    'Posted': 'Posted',
    'Assigned': 'Carrier Assigned',
    'En Route': 'In Transit',
    'Delivered': 'Delivered',
    'POD Received': 'POD Received',
    'Paid': 'Closed',
    'Closed': 'Closed'
  };
  return statusMap[status] || 'Draft';
};

// Helper function to get status badge color
export const getStatusBadgeClass = (status: LoadStatus | ShipperLoadStatus): string => {
  switch(status) {
    case 'New':
      return 'bg-indigo-100 text-indigo-800';
    case 'Draft':
      return 'bg-gray-100 text-gray-800';
    case 'Posted':
      return 'bg-blue-100 text-blue-800';
    case 'Assigned':
    case 'Carrier Assigned':
      return 'bg-green-100 text-green-800';
    case 'En Route':
    case 'In Transit':
      return 'bg-yellow-100 text-yellow-800';
    case 'Delivered':
      return 'bg-purple-100 text-purple-800';
    case 'Awaiting Docs':
    case 'POD Received':
      return 'bg-orange-100 text-orange-800';
    case 'Paid':
    case 'Closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Mock broker list for shipper to select when creating loads
export const mockBrokers = [
  { id: '1', name: 'Shanahan Transportation Systems, Inc.' },
  { id: '2', name: 'Express Freight Brokers' },
  { id: '3', name: 'National Logistics Corp' },
  { id: '4', name: 'Midwest Freight Solutions' },
  { id: '5', name: 'West Coast Brokers' },
  { id: '6', name: 'Northeast Logistics' },
  { id: '7', name: 'Regional Transport Services' }
];