/**
 * Core load type definitions
 * This is the single source of truth for all load-related types
 */

// Load status enum
export enum LoadStatus {
  DRAFT = 'draft',
  POSTED = 'posted',
  BOOKED = 'booked',
  ASSIGNED = 'assigned',
  EN_ROUTE = 'en_route',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  AWAITING_DOCS = 'awaiting_docs',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

// Equipment types
export enum EquipmentType {
  DRY_VAN = 'Dry Van',
  REEFER = 'Reefer',
  FLATBED = 'Flatbed',
  STEP_DECK = 'Step Deck',
  BOX_TRUCK = 'Box Truck',
  POWER_ONLY = 'Power Only',
  OTHER = 'Other'
}

// Base load interface
export interface Load {
  id: string;
  loadNumber: string;
  
  // Location details
  origin: string;
  originCity?: string;
  originState?: string;
  originZip?: string;
  
  destination: string;
  destinationCity?: string;
  destinationState?: string;
  destinationZip?: string;
  
  // Dates
  pickupDate: string; // ISO date string
  deliveryDate: string; // ISO date string
  createdAt?: string;
  updatedAt?: string;
  
  // Load details
  commodity: string;
  weight: number; // in pounds
  distance?: number; // in miles
  equipmentType: EquipmentType | string;
  status: LoadStatus | string;
  
  // Financial
  rate: number; // total rate
  ratePerMile?: number;
  
  // Relationships
  customerId?: string;
  customer?: Customer;
  carrierId?: string;
  carrier?: Carrier;
  driverId?: string;
  driver?: Driver;
  brokerId?: string;
  broker?: Broker;
  
  // Additional info
  notes?: string;
  specialInstructions?: string;
  referenceNumber?: string;
  poNumber?: string;
  
  // Tracking
  currentLocation?: Location;
  eta?: string; // ISO date string
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  
  // Documents
  documents?: LoadDocument[];
}

// Supporting interfaces
export interface Customer {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
}

export interface Carrier {
  id: string;
  name: string;
  mcNumber?: string;
  dotNumber?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  rating?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone?: string;
  truckNumber?: string;
  trailerNumber?: string;
  cdlNumber?: string;
}

export interface Broker {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  timestamp?: string;
}

export interface LoadDocument {
  id: string;
  type: 'bol' | 'pod' | 'invoice' | 'rate_confirmation' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
}

// API request/response types
export interface CreateLoadRequest {
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  commodity: string;
  weight: number;
  equipmentType: string;
  rate: number;
  customerId?: string;
  notes?: string;
  specialInstructions?: string;
}

export interface UpdateLoadRequest {
  status?: LoadStatus;
  carrierId?: string;
  driverId?: string;
  rate?: number;
  notes?: string;
  eta?: string;
}

export interface LoadSearchParams {
  origin?: string;
  destination?: string;
  equipmentType?: string;
  status?: LoadStatus;
  minRate?: number;
  maxRate?: number;
  pickupDateFrom?: string;
  pickupDateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface LoadListResponse {
  content: Load[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// UI-specific types
export interface LoadCardProps {
  load: Load;
  variant?: 'compact' | 'detailed';
  onSelect?: (load: Load) => void;
  actions?: LoadAction[];
}

export interface LoadAction {
  label: string;
  icon?: React.ComponentType;
  onClick: (load: Load) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  condition?: (load: Load) => boolean;
}

// Detailed load view type (used by LoadDetails page)
export interface LoadDetailsData {
  id: string;
  loadNumber: string;
  brokerId: string | null;
  shipperId: string | null;
  carrierId: string | null;
  status: string;
  originAddress: string;
  originCity: string;
  originState: string;
  originZip: string;
  originLat: string;
  originLng: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
  destinationLat: string;
  destinationLng: string;
  distance: number;
  eta: Date;
  commodity: string;
  weight: number;
  equipmentType: string;
  routingType: string;
  rate: string;
  carrierRate: string | null;
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTimeStart: string;
  deliveryTimeEnd: string;
  notes: string;
  specialInstructions: string;
  referenceNumber: string;
  postedToLoadboards: boolean | null;
  createdBy: string | null;
  assignedDispatcher: string | null;
  assignedDriverId: string | null;
  createdAt: string;
  updatedAt: string | null;
  
  // Computed properties
  origin?: string;
  destination?: string;
  ratePerMile?: number;
  customer?: { id: string; name: string };
  carrier?: { id: string; name: string };
  driver?: { id: string; name: string };
}
