import axios from 'axios';
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

const API_BASE = '/api/shipper/wms';

// Warehouse Management
export const warehouseApi = {
  getAll: async (): Promise<Warehouse[]> => {
    const response = await axios.get(`${API_BASE}/warehouses`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Warehouse> => {
    const response = await axios.get(`${API_BASE}/warehouses/${id}`);
    return response.data;
  },
  
  create: async (warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> => {
    const response = await axios.post(`${API_BASE}/warehouses`, warehouse);
    return response.data;
  },
  
  update: async (id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> => {
    const response = await axios.put(`${API_BASE}/warehouses/${id}`, warehouse);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/warehouses/${id}`);
  }
};

// Inventory Management
export const inventoryApi = {
  getItems: async (warehouseId?: string): Promise<InventoryItem[]> => {
    const params = warehouseId ? { warehouseId } : {};
    const response = await axios.get(`${API_BASE}/inventory/items`, { params });
    return response.data;
  },
  
  getItemById: async (id: string): Promise<InventoryItem> => {
    const response = await axios.get(`${API_BASE}/inventory/items/${id}`);
    return response.data;
  },
  
  createItem: async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> => {
    const response = await axios.post(`${API_BASE}/inventory/items`, item);
    return response.data;
  },
  
  updateItem: async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await axios.put(`${API_BASE}/inventory/items/${id}`, item);
    return response.data;
  },
  
  deleteItem: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/inventory/items/${id}`);
  },
  
  // Stock Levels
  getStockLevels: async (itemId?: string, warehouseId?: string): Promise<StockLevel[]> => {
    const params = { itemId, warehouseId };
    const response = await axios.get(`${API_BASE}/inventory/stock-levels`, { params });
    return response.data;
  },
  
  updateStockLevel: async (id: string, updates: Partial<StockLevel>): Promise<StockLevel> => {
    const response = await axios.put(`${API_BASE}/inventory/stock-levels/${id}`, updates);
    return response.data;
  },
  
  // Inventory Movements
  getMovements: async (itemId?: string, warehouseId?: string, type?: string): Promise<InventoryMovement[]> => {
    const params = { itemId, warehouseId, type };
    const response = await axios.get(`${API_BASE}/inventory/movements`, { params });
    return response.data;
  },
  
  createMovement: async (movement: Omit<InventoryMovement, 'id' | 'createdAt'>): Promise<InventoryMovement> => {
    const response = await axios.post(`${API_BASE}/inventory/movements`, movement);
    return response.data;
  },
  
  // Alerts
  getAlerts: async (warehouseId?: string, acknowledged?: boolean): Promise<InventoryAlert[]> => {
    const params = { warehouseId, acknowledged };
    const response = await axios.get(`${API_BASE}/inventory/alerts`, { params });
    return response.data;
  },
  
  acknowledgeAlert: async (id: string, userId: string): Promise<InventoryAlert> => {
    const response = await axios.put(`${API_BASE}/inventory/alerts/${id}/acknowledge`, { userId });
    return response.data;
  }
};

// Shipment Readiness
export const readinessApi = {
  getAll: async (warehouseId?: string, status?: string): Promise<ShipmentReadiness[]> => {
    const params = { warehouseId, status };
    const response = await axios.get(`${API_BASE}/readiness`, { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<ShipmentReadiness> => {
    const response = await axios.get(`${API_BASE}/readiness/${id}`);
    return response.data;
  },
  
  create: async (readiness: Omit<ShipmentReadiness, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShipmentReadiness> => {
    const response = await axios.post(`${API_BASE}/readiness`, readiness);
    return response.data;
  },
  
  update: async (id: string, updates: Partial<ShipmentReadiness>): Promise<ShipmentReadiness> => {
    const response = await axios.put(`${API_BASE}/readiness/${id}`, updates);
    return response.data;
  },
  
  updateItemStatus: async (readinessId: string, itemId: string, status: string, quantity?: number): Promise<ShipmentReadiness> => {
    const response = await axios.put(`${API_BASE}/readiness/${readinessId}/items/${itemId}`, { status, quantity });
    return response.data;
  },
  
  // Pick Lists
  getPickLists: async (readinessId?: string, status?: string): Promise<PickList[]> => {
    const params = { readinessId, status };
    const response = await axios.get(`${API_BASE}/readiness/pick-lists`, { params });
    return response.data;
  },
  
  createPickList: async (pickList: Omit<PickList, 'id' | 'createdAt'>): Promise<PickList> => {
    const response = await axios.post(`${API_BASE}/readiness/pick-lists`, pickList);
    return response.data;
  },
  
  updatePickList: async (id: string, updates: Partial<PickList>): Promise<PickList> => {
    const response = await axios.put(`${API_BASE}/readiness/pick-lists/${id}`, updates);
    return response.data;
  },
  
  markItemPicked: async (pickListId: string, itemId: string): Promise<PickList> => {
    const response = await axios.put(`${API_BASE}/readiness/pick-lists/${pickListId}/items/${itemId}/pick`);
    return response.data;
  }
};

// Notifications
export const notificationApi = {
  sendReadinessNotification: async (notification: Omit<ReadinessNotification, 'id' | 'sent' | 'sentAt' | 'createdAt'>): Promise<ReadinessNotification> => {
    const response = await axios.post(`${API_BASE}/notifications/readiness`, notification);
    return response.data;
  },
  
  getNotifications: async (readinessId?: string, sent?: boolean): Promise<ReadinessNotification[]> => {
    const params = { readinessId, sent };
    const response = await axios.get(`${API_BASE}/notifications`, { params });
    return response.data;
  },
  
  acknowledgeNotification: async (id: string, userId: string): Promise<ReadinessNotification> => {
    const response = await axios.put(`${API_BASE}/notifications/${id}/acknowledge`, { userId });
    return response.data;
  },
  
  createLoadFromReadiness: async (readinessId: string): Promise<{ loadId: string; orderId: string }> => {
    const response = await axios.post(`${API_BASE}/notifications/create-load`, { readinessId });
    return response.data;
  }
};

// Cycle Counting
export const cycleCountApi = {
  getAll: async (warehouseId?: string, status?: string): Promise<CycleCount[]> => {
    const params = { warehouseId, status };
    const response = await axios.get(`${API_BASE}/cycle-counts`, { params });
    return response.data;
  },
  
  create: async (cycleCount: Omit<CycleCount, 'id' | 'createdAt'>): Promise<CycleCount> => {
    const response = await axios.post(`${API_BASE}/cycle-counts`, cycleCount);
    return response.data;
  },
  
  update: async (id: string, updates: Partial<CycleCount>): Promise<CycleCount> => {
    const response = await axios.put(`${API_BASE}/cycle-counts/${id}`, updates);
    return response.data;
  },
  
  submitCount: async (cycleCountId: string, itemId: string, countedQuantity: number, userId: string): Promise<CycleCount> => {
    const response = await axios.put(`${API_BASE}/cycle-counts/${cycleCountId}/items/${itemId}`, {
      countedQuantity,
      countedBy: userId
    });
    return response.data;
  }
};

// Metrics and Analytics
export const metricsApi = {
  getWarehouseMetrics: async (warehouseId: string, startDate: string, endDate: string): Promise<WMSMetrics> => {
    const params = { startDate, endDate };
    const response = await axios.get(`${API_BASE}/metrics/warehouse/${warehouseId}`, { params });
    return response.data;
  },
  
  getInventoryTurnover: async (warehouseId: string, period = 30): Promise<{ turnoverRate: number; items: Array<{ itemId: string; rate: number }> }> => {
    const response = await axios.get(`${API_BASE}/metrics/inventory-turnover/${warehouseId}`, { params: { period } });
    return response.data;
  },
  
  getLowStockItems: async (warehouseId?: string): Promise<Array<{ item: InventoryItem; currentStock: number; reorderPoint: number }>> => {
    const params = warehouseId ? { warehouseId } : {};
    const response = await axios.get(`${API_BASE}/metrics/low-stock`, { params });
    return response.data;
  },
  
  getExpiringItems: async (warehouseId?: string, days = 30): Promise<Array<{ item: InventoryItem; expirationDate: string; daysUntilExpiry: number }>> => {
    const params = { warehouseId, days };
    const response = await axios.get(`${API_BASE}/metrics/expiring`, { params });
    return response.data;
  }
};