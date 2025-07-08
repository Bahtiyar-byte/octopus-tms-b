export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  capacity: number;
  usedCapacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  manager: {
    name: string;
    email: string;
    phone: string;
  };
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitOfMeasure: 'each' | 'case' | 'pallet' | 'box' | 'kg' | 'lb';
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  value: number;
  reorderPoint: number;
  reorderQuantity: number;
  hazmat: boolean;
  fragile: boolean;
  temperatureControlled: boolean;
  shelfLife?: number; // in days
  createdAt: string;
  updatedAt: string;
}

export interface StockLevel {
  id: string;
  itemId: string;
  warehouseId: string;
  quantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  location: {
    zone: string;
    aisle: string;
    rack: string;
    bin: string;
  };
  batchNumber?: string;
  expirationDate?: string;
  lastCountDate: string;
  status: 'available' | 'reserved' | 'allocated' | 'damaged' | 'quarantine';
}

export interface InventoryMovement {
  id: string;
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
  itemId: string;
  warehouseId: string;
  fromLocation?: string;
  toLocation?: string;
  quantity: number;
  reason: string;
  referenceNumber?: string;
  performedBy: string;
  createdAt: string;
}

export interface ShipmentReadiness {
  id: string;
  orderId?: string;
  warehouseId: string;
  status: 'pending' | 'ready' | 'partially_ready' | 'shipped';
  items: Array<{
    itemId: string;
    sku: string;
    name: string;
    requiredQuantity: number;
    availableQuantity: number;
    pickedQuantity: number;
    status: 'pending' | 'picking' | 'picked' | 'packed';
  }>;
  requiredDate: string;
  readyDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickList {
  id: string;
  readinessId: string;
  warehouseId: string;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  items: Array<{
    itemId: string;
    location: string;
    quantity: number;
    picked: boolean;
    pickedAt?: string;
  }>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'expiration' | 'damage' | 'cycle_count' | 'reorder';
  severity: 'info' | 'warning' | 'critical';
  itemId?: string;
  warehouseId: string;
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export interface CycleCount {
  id: string;
  warehouseId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'full' | 'partial' | 'random';
  items: Array<{
    itemId: string;
    location: string;
    systemQuantity: number;
    countedQuantity?: number;
    variance?: number;
    countedBy?: string;
    countedAt?: string;
  }>;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  performedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface WMSMetrics {
  warehouseId: string;
  inventoryAccuracy: number;
  fillRate: number;
  cycleTime: number;
  orderAccuracy: number;
  inventoryTurnover: number;
  stockouts: number;
  damageRate: number;
  utilizationRate: number;
  pickingAccuracy: number;
  shippingAccuracy: number;
  period: {
    start: string;
    end: string;
  };
}

export interface ReadinessNotification {
  id: string;
  readinessId: string;
  warehouseId: string;
  type: 'shipment_ready' | 'partial_ready' | 'delay_alert';
  recipients: string[];
  message: string;
  metadata: {
    orderId?: string;
    items: Array<{
      sku: string;
      name: string;
      quantity: number;
    }>;
    estimatedPickupTime?: string;
  };
  sent: boolean;
  sentAt?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}