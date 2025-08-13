import { ApiClient } from '../../../services/api';
import {
  Warehouse,
  InventoryItem,
  StockLevel,
  InventoryMovement,
  ShipmentReadiness,
  PickList,
  InventoryAlert,
  CycleCount,
  WMSMetrics,
  ReadinessNotification
} from '../types/wms.types';

const API_BASE = '/shipper/wms';

// Warehouse Management
export const warehouseApi = {
  getAll: async (): Promise<Warehouse[]> => {
    return await ApiClient.get<Warehouse[]>(`${API_BASE}/warehouses`);
  },
  
  getById: async (id: string): Promise<Warehouse> => {
    return await ApiClient.get<Warehouse>(`${API_BASE}/warehouses/${id}`);
  },
  
  create: async (warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> => {
    return await ApiClient.post<Warehouse>(`${API_BASE}/warehouses`, warehouse);
  },
  
  update: async (id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> => {
    return await ApiClient.put<Warehouse>(`${API_BASE}/warehouses/${id}`, warehouse);
  },
  
  delete: async (id: string): Promise<void> => {
    await ApiClient.delete<void>(`${API_BASE}/warehouses/${id}`);
  }
};

// Inventory Management
export const inventoryApi = {
  getItems: async (warehouseId?: string): Promise<InventoryItem[]> => {
    const params = warehouseId ? { warehouseId } : {};
    return await ApiClient.get<InventoryItem[]>(`${API_BASE}/inventory/items`, { params });
  },
  
  getItemById: async (id: string): Promise<InventoryItem> => {
    return await ApiClient.get<InventoryItem>(`${API_BASE}/inventory/items/${id}`);
  },
  
  createItem: async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> => {
    return await ApiClient.post<InventoryItem>(`${API_BASE}/inventory/items`, item);
  },
  
  updateItem: async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
    return await ApiClient.put<InventoryItem>(`${API_BASE}/inventory/items/${id}`, item);
  },
  
  deleteItem: async (id: string): Promise<void> => {
    await ApiClient.delete<void>(`${API_BASE}/inventory/items/${id}`);
  },
  
  // Stock Levels
  getStockLevels: async (itemId?: string, warehouseId?: string): Promise<StockLevel[]> => {
    const params = { itemId, warehouseId };
    return await ApiClient.get<StockLevel[]>(`${API_BASE}/inventory/stock-levels`, { params });
  },
  
  updateStockLevel: async (id: string, updates: Partial<StockLevel>): Promise<StockLevel> => {
    return await ApiClient.put<StockLevel>(`${API_BASE}/inventory/stock-levels/${id}`, updates);
  },
  
  // Inventory Movements
  getMovements: async (itemId?: string, warehouseId?: string, type?: string): Promise<InventoryMovement[]> => {
    const params = { itemId, warehouseId, type };
    return await ApiClient.get<InventoryMovement[]>(`${API_BASE}/inventory/movements`, { params });
  },
  
  createMovement: async (movement: Omit<InventoryMovement, 'id' | 'createdAt'>): Promise<InventoryMovement> => {
    return await ApiClient.post<InventoryMovement>(`${API_BASE}/inventory/movements`, movement);
  },
  
  // Alerts
  getAlerts: async (warehouseId?: string, acknowledged?: boolean): Promise<InventoryAlert[]> => {
    const params = { warehouseId, acknowledged };
    return await ApiClient.get<InventoryAlert[]>(`${API_BASE}/inventory/alerts`, { params });
  },
  
  acknowledgeAlert: async (id: string, userId: string): Promise<InventoryAlert> => {
    return await ApiClient.put<InventoryAlert>(`${API_BASE}/inventory/alerts/${id}/acknowledge`, { userId });
  }
};

// Shipment Readiness
export const readinessApi = {
  getAll: async (warehouseId?: string, status?: string): Promise<ShipmentReadiness[]> => {
    const params = { warehouseId, status };
    return await ApiClient.get<ShipmentReadiness[]>(`${API_BASE}/readiness`, { params });
  },
  
  getById: async (id: string): Promise<ShipmentReadiness> => {
    return await ApiClient.get<ShipmentReadiness>(`${API_BASE}/readiness/${id}`);
  },
  
  create: async (readiness: Omit<ShipmentReadiness, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShipmentReadiness> => {
    return await ApiClient.post<ShipmentReadiness>(`${API_BASE}/readiness`, readiness);
  },
  
  update: async (id: string, updates: Partial<ShipmentReadiness>): Promise<ShipmentReadiness> => {
    return await ApiClient.put<ShipmentReadiness>(`${API_BASE}/readiness/${id}`, updates);
  },
  
  updateItemStatus: async (readinessId: string, itemId: string, status: string, quantity?: number): Promise<ShipmentReadiness> => {
    return await ApiClient.put<ShipmentReadiness>(`${API_BASE}/readiness/${readinessId}/items/${itemId}`, { status, quantity });
  },
  
  // Pick Lists
  getPickLists: async (readinessId?: string, status?: string): Promise<PickList[]> => {
    const params = { readinessId, status };
    return await ApiClient.get<PickList[]>(`${API_BASE}/readiness/pick-lists`, { params });
  },
  
  createPickList: async (pickList: Omit<PickList, 'id' | 'createdAt'>): Promise<PickList> => {
    return await ApiClient.post<PickList>(`${API_BASE}/readiness/pick-lists`, pickList);
  },
  
  updatePickList: async (id: string, updates: Partial<PickList>): Promise<PickList> => {
    return await ApiClient.put<PickList>(`${API_BASE}/readiness/pick-lists/${id}`, updates);
  },
  
  markItemPicked: async (pickListId: string, itemId: string): Promise<PickList> => {
    return await ApiClient.put<PickList>(`${API_BASE}/readiness/pick-lists/${pickListId}/items/${itemId}/pick`);
  }
};

// Notifications
export const notificationApi = {
  sendReadinessNotification: async (notification: Omit<ReadinessNotification, 'id' | 'sent' | 'sentAt' | 'createdAt'>): Promise<ReadinessNotification> => {
    return await ApiClient.post<ReadinessNotification>(`${API_BASE}/notifications/readiness`, notification);
  },
  
  getNotifications: async (readinessId?: string, sent?: boolean): Promise<ReadinessNotification[]> => {
    const params = { readinessId, sent };
    return await ApiClient.get<ReadinessNotification[]>(`${API_BASE}/notifications`, { params });
  },
  
  acknowledgeNotification: async (id: string, userId: string): Promise<ReadinessNotification> => {
    return await ApiClient.put<ReadinessNotification>(`${API_BASE}/notifications/${id}/acknowledge`, { userId });
  },
  
  createLoadFromReadiness: async (readinessId: string): Promise<{ loadId: string; orderId: string }> => {
    return await ApiClient.post<{ loadId: string; orderId: string }>(`${API_BASE}/notifications/create-load`, { readinessId });
  }
};

// Cycle Counting
export const cycleCountApi = {
  getAll: async (warehouseId?: string, status?: string): Promise<CycleCount[]> => {
    const params = { warehouseId, status };
    return await ApiClient.get<CycleCount[]>(`${API_BASE}/cycle-counts`, { params });
  },
  
  create: async (cycleCount: Omit<CycleCount, 'id' | 'createdAt'>): Promise<CycleCount> => {
    return await ApiClient.post<CycleCount>(`${API_BASE}/cycle-counts`, cycleCount);
  },
  
  update: async (id: string, updates: Partial<CycleCount>): Promise<CycleCount> => {
    return await ApiClient.put<CycleCount>(`${API_BASE}/cycle-counts/${id}`, updates);
  },
  
  submitCount: async (cycleCountId: string, itemId: string, countedQuantity: number, userId: string): Promise<CycleCount> => {
    return await ApiClient.put<CycleCount>(`${API_BASE}/cycle-counts/${cycleCountId}/items/${itemId}`, {
      countedQuantity,
      countedBy: userId
    });
  }
};

// Metrics and Analytics
export const metricsApi = {
  getWarehouseMetrics: async (warehouseId: string, startDate: string, endDate: string): Promise<WMSMetrics> => {
    const params = { startDate, endDate };
    return await ApiClient.get<WMSMetrics>(`${API_BASE}/metrics/warehouse/${warehouseId}`, { params });
  },
  
  getInventoryTurnover: async (warehouseId: string, period = 30): Promise<{ turnoverRate: number; items: Array<{ itemId: string; rate: number }> }> => {
    return await ApiClient.get<{ turnoverRate: number; items: Array<{ itemId: string; rate: number }> }>(
      `${API_BASE}/metrics/inventory-turnover/${warehouseId}`, 
      { params: { period } }
    );
  },
  
  getLowStockItems: async (warehouseId?: string): Promise<Array<{ item: InventoryItem; currentStock: number; reorderPoint: number }>> => {
    const params = warehouseId ? { warehouseId } : {};
    return await ApiClient.get<Array<{ item: InventoryItem; currentStock: number; reorderPoint: number }>>(
      `${API_BASE}/metrics/low-stock`, 
      { params }
    );
  },
  
  getExpiringItems: async (warehouseId?: string, days = 30): Promise<Array<{ item: InventoryItem; expirationDate: string; daysUntilExpiry: number }>> => {
    const params = { warehouseId, days };
    return await ApiClient.get<Array<{ item: InventoryItem; expirationDate: string; daysUntilExpiry: number }>>(
      `${API_BASE}/metrics/expiring`, 
      { params }
    );
  }
};