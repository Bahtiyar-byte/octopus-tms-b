import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Bell, Package, Truck, AlertCircle } from 'lucide-react';
import { WarehouseOverview, InventoryItemCard, ShipmentReadinessCard, InventoryAlertCard } from '../components/wms';
// import { warehouseApi, inventoryApi, readinessApi, notificationApi } from '../api/wmsApi';
import { 
  Warehouse, 
  InventoryItem, 
  StockLevel, 
  ShipmentReadiness, 
  InventoryAlert,
  ReadinessNotification 
} from '../types/wms.types';
import { toast } from 'react-hot-toast';

export const WarehouseDashboard: React.FC = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [shipmentReadiness, setShipmentReadiness] = useState<ShipmentReadiness[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'readiness' | 'alerts'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWarehouses();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      loadWarehouseData();
    }
  }, [selectedWarehouse]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadWarehouses = async () => {
    try {
      // Mock data for demo
      const mockWarehouses: Warehouse[] = [
        {
          id: 'wh-001',
          name: 'Main Distribution Center',
          code: 'MDC-001',
          address: {
            street: '123 Logistics Way',
            city: 'Atlanta',
            state: 'GA',
            zipCode: '30301',
            country: 'USA'
          },
          capacity: 50000,
          usedCapacity: 35000,
          status: 'active',
          manager: {
            name: 'John Smith',
            email: 'john.smith@company.com',
            phone: '+1 (404) 555-0123'
          },
          operatingHours: {
            monday: { open: '06:00', close: '22:00' },
            tuesday: { open: '06:00', close: '22:00' },
            wednesday: { open: '06:00', close: '22:00' },
            thursday: { open: '06:00', close: '22:00' },
            friday: { open: '06:00', close: '22:00' },
            saturday: { open: '08:00', close: '18:00' },
            sunday: { open: 'closed', close: 'closed' }
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
      setWarehouses(mockWarehouses);
      if (mockWarehouses.length > 0) {
        setSelectedWarehouse(mockWarehouses[0].id);
      }
    } catch (error) {
      console.error('Error loading warehouses:', error);
      toast.error('Failed to load warehouses');
    }
  };

  const loadWarehouseData = async () => {
    setLoading(true);
    try {
      // Mock data for demo
      const mockInventory: InventoryItem[] = [
        {
          id: 'item-001',
          sku: 'WIDGET-001',
          name: 'Premium Widget',
          description: 'High-quality widget for industrial use',
          category: 'Widgets',
          unitOfMeasure: 'each',
          weight: 2.5,
          dimensions: { length: 10, width: 8, height: 6, unit: 'in' },
          value: 150,
          reorderPoint: 100,
          reorderQuantity: 500,
          hazmat: false,
          fragile: false,
          temperatureControlled: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'item-002',
          sku: 'GADGET-002',
          name: 'Electronic Gadget',
          description: 'Advanced electronic component',
          category: 'Electronics',
          unitOfMeasure: 'case',
          weight: 15,
          dimensions: { length: 20, width: 15, height: 10, unit: 'in' },
          value: 500,
          reorderPoint: 50,
          reorderQuantity: 200,
          hazmat: false,
          fragile: true,
          temperatureControlled: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      const mockStockLevels: StockLevel[] = [
        {
          id: 'stock-001',
          itemId: 'item-001',
          warehouseId: selectedWarehouse,
          quantity: 450,
          availableQuantity: 85,
          reservedQuantity: 365,
          location: { zone: 'A', aisle: '12', rack: '3', bin: 'B' },
          lastCountDate: '2024-01-15T00:00:00Z',
          status: 'available'
        },
        {
          id: 'stock-002',
          itemId: 'item-002',
          warehouseId: selectedWarehouse,
          quantity: 200,
          availableQuantity: 45,
          reservedQuantity: 155,
          location: { zone: 'B', aisle: '5', rack: '2', bin: 'A' },
          lastCountDate: '2024-01-15T00:00:00Z',
          status: 'available'
        }
      ];

      const mockReadiness: ShipmentReadiness[] = [
        {
          id: 'ready-001',
          orderId: 'ORD-2024-001',
          warehouseId: selectedWarehouse,
          status: 'partially_ready',
          items: [
            {
              itemId: 'item-001',
              sku: 'WIDGET-001',
              name: 'Premium Widget',
              requiredQuantity: 50,
              availableQuantity: 85,
              pickedQuantity: 35,
              status: 'picking'
            },
            {
              itemId: 'item-002',
              sku: 'GADGET-002',
              name: 'Electronic Gadget',
              requiredQuantity: 20,
              availableQuantity: 45,
              pickedQuantity: 20,
              status: 'picked'
            }
          ],
          requiredDate: '2024-01-28T00:00:00Z',
          priority: 'high',
          specialInstructions: 'Handle with care - fragile items',
          createdAt: '2024-01-25T00:00:00Z',
          updatedAt: '2024-01-25T00:00:00Z'
        }
      ];

      const mockAlerts: InventoryAlert[] = [
        {
          id: 'alert-001',
          type: 'low_stock',
          severity: 'warning',
          itemId: 'item-001',
          warehouseId: selectedWarehouse,
          message: 'Premium Widget stock level is below reorder point (85 units remaining)',
          acknowledged: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'alert-002',
          type: 'cycle_count',
          severity: 'info',
          warehouseId: selectedWarehouse,
          message: 'Monthly cycle count scheduled for Zone A',
          acknowledged: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setInventoryItems(mockInventory);
      setStockLevels(mockStockLevels);
      setShipmentReadiness(mockReadiness);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading warehouse data:', error);
      toast.error('Failed to load warehouse data');
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyTMS = async (readinessId: string) => {
    try {
      const readiness = shipmentReadiness.find(r => r.id === readinessId);
      if (!readiness) return;

      const _notification: Omit<ReadinessNotification, 'id' | 'sent' | 'sentAt' | 'createdAt'> = {
        readinessId,
        warehouseId: selectedWarehouse,
        type: readiness.status === 'ready' ? 'shipment_ready' : 'partial_ready',
        recipients: ['tms@company.com'],
        message: `Shipment ${readiness.orderId ? `for Order ${readiness.orderId}` : readinessId} is ${readiness.status === 'ready' ? 'ready' : 'partially ready'} for pickup`,
        metadata: {
          orderId: readiness.orderId,
          items: readiness.items.map(item => ({
            sku: item.sku,
            name: item.name,
            quantity: item.pickedQuantity
          })),
          estimatedPickupTime: new Date(Date.now() + 7200000).toISOString() // 2 hours from now
        },
        acknowledged: false
      };

      // In a real app, this would send the notification
      toast.success('TMS notified successfully! Load/Order will be created.');
      
      // Update readiness status
      const updatedReadiness = shipmentReadiness.map(r => 
        r.id === readinessId ? { ...r, status: 'shipped' as const } : r
      );
      setShipmentReadiness(updatedReadiness);
    } catch (error) {
      console.error('Error notifying TMS:', error);
      toast.error('Failed to notify TMS');
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const updatedAlerts = alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, acknowledgedBy: 'current-user', acknowledgedAt: new Date().toISOString() }
          : alert
      );
      setAlerts(updatedAlerts);
      toast.success('Alert acknowledged');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  const filteredInventory = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentWarehouse = warehouses.find(w => w.id === selectedWarehouse);
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Management System</h1>
          <p className="text-gray-600 mt-1">Manage inventory, track shipments, and monitor warehouse operations</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {unacknowledgedAlerts > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unacknowledgedAlerts}
                </span>
              )}
            </button>
          </div>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentWarehouse && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WarehouseOverview
            warehouse={currentWarehouse}
            metrics={{
              totalItems: inventoryItems.length,
              lowStockItems: stockLevels.filter(s => {
                const item = inventoryItems.find(i => i.id === s.itemId);
                return item && s.availableQuantity <= item.reorderPoint;
              }).length,
              pendingShipments: shipmentReadiness.filter(r => r.status === 'pending' || r.status === 'partially_ready').length,
              utilizationRate: Math.round((currentWarehouse.usedCapacity / currentWarehouse.capacity) * 100)
            }}
          />
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'inventory'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Inventory ({inventoryItems.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('readiness')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'readiness'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>Shipments ({shipmentReadiness.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                      activeTab === 'alerts'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Alerts ({alerts.length})</span>
                      {unacknowledgedAlerts > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                      )}
                    </div>
                  </button>
                </div>
                
                {activeTab === 'inventory' && (
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
                      <Filter className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Item</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'inventory' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredInventory.map(item => {
                          const stock = stockLevels.find(s => s.itemId === item.id);
                          if (!stock) return null;
                          return (
                            <InventoryItemCard
                              key={item.id}
                              item={item}
                              stockLevel={stock}
                              onEdit={() => console.log('Edit item:', item.id)}
                              onViewDetails={() => console.log('View details:', item.id)}
                            />
                          );
                        })}
                      </div>
                    )}

                    {activeTab === 'readiness' && (
                      <div className="space-y-4">
                        {shipmentReadiness.map(readiness => (
                          <ShipmentReadinessCard
                            key={readiness.id}
                            readiness={readiness}
                            onNotifyTMS={() => handleNotifyTMS(readiness.id)}
                            onViewDetails={() => console.log('View readiness:', readiness.id)}
                            onCreatePickList={() => console.log('Create pick list:', readiness.id)}
                          />
                        ))}
                      </div>
                    )}

                    {activeTab === 'alerts' && (
                      <div className="space-y-3">
                        {alerts.map(alert => (
                          <InventoryAlertCard
                            key={alert.id}
                            alert={alert}
                            onAcknowledge={() => handleAcknowledgeAlert(alert.id)}
                            onViewDetails={() => console.log('View alert:', alert.id)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};