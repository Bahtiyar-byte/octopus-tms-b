// Role-based configuration system for shared components

export interface Action {
  name: string;
  icon?: string;
  handler?: string;
  permissions?: string[];
}

export interface ValidationRule {
  field: string;
  rules: string[];
  message?: string;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  props?: Record<string, any>;
}

export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number';
  options?: Array<{ value: string; label: string }>;
}

export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface PageConfig {
  title?: string;
  fields?: string[];
  actions?: Action[];
  validations?: ValidationRule[];
  widgets?: WidgetConfig[];
  columns?: ColumnConfig[];
  filters?: FilterConfig[];
  permissions?: string[];
}

export interface RoleConfiguration {
  // Page-level configs
  dashboard: Record<string, PageConfig>;
  loads: Record<string, PageConfig>;
  tracking: Record<string, PageConfig>;
  reports: Record<string, PageConfig>;
  profile: Record<string, PageConfig>;
  settings: Record<string, PageConfig>;
  invoices: Record<string, PageConfig>;
  customers: Record<string, PageConfig>;
  documents: Record<string, PageConfig>;
  
  // Navigation config
  navigation: Record<string, NavigationItem[]>;
}

// Base/default configuration for common elements
const BASE_CONFIG: Partial<RoleConfiguration> = {
  dashboard: {
    BASE: {
      title: 'Dashboard',
      widgets: [
        {
          id: 'welcome',
          type: 'welcome',
          title: 'Welcome',
          size: 'full'
        }
      ]
    }
  },
  profile: {
    BASE: {
      title: 'My Profile',
      fields: ['firstName', 'lastName', 'email', 'phone', 'avatar'],
      actions: [
        { name: 'save', icon: 'save' },
        { name: 'cancel', icon: 'cancel' }
      ]
    }
  },
  settings: {
    BASE: {
      title: 'Settings',
      fields: ['notifications', 'language', 'timezone', 'theme']
    }
  }
};

// Role-specific configurations
const roleConfig: RoleConfiguration = {
  dashboard: {
    ...BASE_CONFIG.dashboard,
    BROKER: {
      title: 'Dashboard',
      widgets: [
        {
          id: 'revenue',
          type: 'revenue',
          title: 'Revenue Overview',
          size: 'medium'
        },
        {
          id: 'activeLoads',
          type: 'activeLoads',
          title: 'Active Loads',
          size: 'medium'
        },
        {
          id: 'carriers',
          type: 'carriers',
          title: 'Top Carriers',
          size: 'medium'
        },
        {
          id: 'weather',
          type: 'weather',
          title: 'Weather',
          size: 'small'
        },
        {
          id: 'recentActivity',
          type: 'activity',
          title: 'Recent Activity',
          size: 'large'
        }
      ]
    },
    SHIPPER: {
      title: 'Shipper Dashboard',
      widgets: [
        {
          id: 'inventory',
          type: 'inventory',
          title: 'Inventory Status',
          size: 'medium'
        },
        {
          id: 'shipments',
          type: 'shipments',
          title: 'Pending Shipments',
          size: 'medium'
        },
        {
          id: 'warehouses',
          type: 'warehouses',
          title: 'Warehouse Overview',
          size: 'large'
        },
        {
          id: 'weather',
          type: 'weather',
          title: 'Weather',
          size: 'small'
        }
      ]
    },
    CARRIER: {
      title: 'Carrier Dashboard',
      widgets: [
        {
          id: 'drivers',
          type: 'drivers',
          title: 'Driver Status',
          size: 'medium'
        },
        {
          id: 'equipment',
          type: 'equipment',
          title: 'Equipment Overview',
          size: 'medium'
        },
        {
          id: 'loads',
          type: 'availableLoads',
          title: 'Available Loads',
          size: 'large'
        },
        {
          id: 'weather',
          type: 'weather',
          title: 'Weather',
          size: 'small'
        }
      ]
    }
  },
  
  loads: {
    BASE: {
      title: 'Loads',
      columns: [
        { key: 'loadId', header: 'Load ID', sortable: true },
        { key: 'origin', header: 'Origin', sortable: true },
        { key: 'destination', header: 'Destination', sortable: true },
        { key: 'status', header: 'Status', sortable: true, filterable: true },
        { key: 'pickupDate', header: 'Pickup Date', sortable: true }
      ],
      filters: [
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'all', label: 'All' },
          { value: 'available', label: 'Available' },
          { value: 'assigned', label: 'Assigned' },
          { value: 'in_transit', label: 'In Transit' },
          { value: 'delivered', label: 'Delivered' }
        ]},
        { key: 'dateRange', label: 'Date Range', type: 'dateRange' }
      ]
    },
    BROKER: {
      title: 'Broker Loads',
      actions: [
        { name: 'create', icon: 'plus', handler: 'createLoad' },
        { name: 'match', icon: 'search', handler: 'matchCarrier' },
        { name: 'export', icon: 'download', handler: 'exportLoads' }
      ],
      columns: [
        ...BASE_CONFIG.loads?.BASE?.columns || [],
        { key: 'customer', header: 'Customer', sortable: true },
        { key: 'carrier', header: 'Carrier', sortable: true },
        { key: 'rate', header: 'Rate', sortable: true }
      ]
    },
    SHIPPER: {
      title: 'Shipments',
      actions: [
        { name: 'create', icon: 'plus', handler: 'createShipment' },
        { name: 'schedule', icon: 'calendar', handler: 'schedulePickup' }
      ],
      columns: [
        ...BASE_CONFIG.loads?.BASE?.columns || [],
        { key: 'product', header: 'Product', sortable: true },
        { key: 'quantity', header: 'Quantity', sortable: true },
        { key: 'warehouse', header: 'Warehouse', sortable: true }
      ]
    },
    CARRIER: {
      title: 'Available Loads',
      actions: [
        { name: 'search', icon: 'search', handler: 'searchLoads' },
        { name: 'filter', icon: 'filter', handler: 'filterLoads' }
      ],
      columns: [
        ...BASE_CONFIG.loads?.BASE?.columns || [],
        { key: 'miles', header: 'Miles', sortable: true },
        { key: 'rate', header: 'Rate/Mile', sortable: true },
        { key: 'equipment', header: 'Equipment', filterable: true }
      ]
    }
  },
  
  tracking: {
    BASE: {
      title: 'Load Tracking',
      fields: ['map', 'loadDetails', 'timeline'],
      actions: [
        { name: 'refresh', icon: 'refresh' },
        { name: 'share', icon: 'share' }
      ]
    },
    BROKER: {
      actions: [
        ...BASE_CONFIG.tracking?.BASE?.actions || [],
        { name: 'contact', icon: 'phone', handler: 'contactCarrier' },
        { name: 'update', icon: 'edit', handler: 'updateStatus' }
      ]
    },
    SHIPPER: {
      fields: ['map', 'loadDetails', 'timeline', 'inventory'],
      actions: [
        ...BASE_CONFIG.tracking?.BASE?.actions || [],
        { name: 'notify', icon: 'bell', handler: 'notifyWarehouse' }
      ]
    },
    CARRIER: {
      actions: [
        ...BASE_CONFIG.tracking?.BASE?.actions || [],
        { name: 'update', icon: 'location', handler: 'updateLocation' },
        { name: 'complete', icon: 'check', handler: 'markDelivered' }
      ]
    }
  },
  
  reports: {
    BASE: {
      title: 'Reports',
      actions: [
        { name: 'generate', icon: 'play' },
        { name: 'export', icon: 'download' },
        { name: 'schedule', icon: 'calendar' }
      ]
    },
    BROKER: {
      filters: [
        { key: 'type', label: 'Report Type', type: 'select', options: [
          { value: 'revenue', label: 'Revenue Report' },
          { value: 'carrier_performance', label: 'Carrier Performance' },
          { value: 'customer_analysis', label: 'Customer Analysis' },
          { value: 'load_summary', label: 'Load Summary' }
        ]}
      ]
    },
    SHIPPER: {
      filters: [
        { key: 'type', label: 'Report Type', type: 'select', options: [
          { value: 'inventory', label: 'Inventory Report' },
          { value: 'shipment_history', label: 'Shipment History' },
          { value: 'warehouse_utilization', label: 'Warehouse Utilization' },
          { value: 'cost_analysis', label: 'Cost Analysis' }
        ]}
      ]
    },
    CARRIER: {
      filters: [
        { key: 'type', label: 'Report Type', type: 'select', options: [
          { value: 'driver_logs', label: 'Driver Logs' },
          { value: 'equipment_maintenance', label: 'Equipment Maintenance' },
          { value: 'fuel_efficiency', label: 'Fuel Efficiency' },
          { value: 'revenue_miles', label: 'Revenue per Mile' }
        ]}
      ]
    }
  },
  
  profile: {
    ...BASE_CONFIG.profile,
    BROKER: {
      ...BASE_CONFIG.profile?.BASE,
      fields: [
        ...BASE_CONFIG.profile?.BASE?.fields || [],
        'commission', 'brokerLicense', 'territory'
      ]
    },
    SHIPPER: {
      ...BASE_CONFIG.profile?.BASE,
      fields: [
        ...BASE_CONFIG.profile?.BASE?.fields || [],
        'companySize', 'mainProducts', 'warehouses'
      ]
    },
    CARRIER: {
      ...BASE_CONFIG.profile?.BASE,
      fields: [
        ...BASE_CONFIG.profile?.BASE?.fields || [],
        'mcNumber', 'dotNumber', 'insurance', 'safetyRating'
      ]
    }
  },
  
  settings: {
    ...BASE_CONFIG.settings,
    BROKER: {
      ...BASE_CONFIG.settings?.BASE,
      fields: [
        ...BASE_CONFIG.settings?.BASE?.fields || [],
        'carrierPreferences', 'rateAlerts', 'autoMatch'
      ]
    },
    SHIPPER: {
      ...BASE_CONFIG.settings?.BASE,
      fields: [
        ...BASE_CONFIG.settings?.BASE?.fields || [],
        'warehouseDefaults', 'pickupWindows', 'productCategories'
      ]
    },
    CARRIER: {
      ...BASE_CONFIG.settings?.BASE,
      fields: [
        ...BASE_CONFIG.settings?.BASE?.fields || [],
        'equipmentTypes', 'serviceAreas', 'driverAlerts', 'safetyCompliance'
      ]
    }
  },
  
  invoices: {
    BASE: {
      title: 'Invoices',
      columns: [
        { key: 'invoiceNumber', header: 'Invoice #', sortable: true },
        { key: 'date', header: 'Date', sortable: true },
        { key: 'amount', header: 'Amount', sortable: true },
        { key: 'status', header: 'Status', sortable: true, filterable: true }
      ],
      actions: [
        { name: 'view', icon: 'eye' },
        { name: 'download', icon: 'download' },
        { name: 'send', icon: 'mail' }
      ]
    },
    BROKER: {
      columns: [
        ...BASE_CONFIG.invoices?.BASE?.columns || [],
        { key: 'customer', header: 'Customer', sortable: true },
        { key: 'commission', header: 'Commission', sortable: true }
      ]
    },
    CARRIER: {
      columns: [
        ...BASE_CONFIG.invoices?.BASE?.columns || [],
        { key: 'broker', header: 'Broker', sortable: true },
        { key: 'loadCount', header: 'Loads', sortable: true }
      ]
    }
  },
  
  customers: {
    BASE: {
      title: 'Customers',
      columns: [
        { key: 'name', header: 'Customer Name', sortable: true },
        { key: 'contact', header: 'Contact', sortable: true },
        { key: 'email', header: 'Email', sortable: true },
        { key: 'phone', header: 'Phone', sortable: true }
      ]
    },
    BROKER: {
      actions: [
        { name: 'add', icon: 'plus', handler: 'addCustomer' },
        { name: 'edit', icon: 'edit', handler: 'editCustomer' },
        { name: 'contract', icon: 'document', handler: 'viewContract' }
      ],
      columns: [
        ...BASE_CONFIG.customers?.BASE?.columns || [],
        { key: 'totalLoads', header: 'Total Loads', sortable: true },
        { key: 'revenue', header: 'Revenue', sortable: true }
      ]
    }
  },
  
  documents: {
    BASE: {
      title: 'Documents',
      actions: [
        { name: 'upload', icon: 'upload' },
        { name: 'download', icon: 'download' },
        { name: 'delete', icon: 'trash' }
      ],
      filters: [
        { key: 'type', label: 'Document Type', type: 'select', options: [
          { value: 'all', label: 'All Documents' },
          { value: 'bol', label: 'Bill of Lading' },
          { value: 'pod', label: 'Proof of Delivery' },
          { value: 'invoice', label: 'Invoice' },
          { value: 'other', label: 'Other' }
        ]}
      ]
    }
  },
  
  // Navigation configuration
  navigation: {
    BROKER: [
      { path: '/broker/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/broker/loads', label: 'Loads', icon: 'truck' },
      { path: '/broker/tracking', label: 'Tracking', icon: 'location' },
      { path: '/broker/carriers', label: 'Carriers', icon: 'users' },
      { path: '/broker/customers', label: 'Customers', icon: 'building' },
      { path: '/broker/invoices', label: 'Invoices', icon: 'invoice' },
      { path: '/broker/reports', label: 'Reports', icon: 'chart' },
      { path: '/broker/documents', label: 'Documents', icon: 'document' }
    ],
    SHIPPER: [
      { path: '/shipper/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/shipper/loads', label: 'Shipments', icon: 'truck' },
      { path: '/shipper/tracking', label: 'Tracking', icon: 'location' },
      { path: '/shipper/inventory', label: 'Inventory', icon: 'box' },
      { path: '/shipper/warehouses', label: 'Warehouses', icon: 'warehouse' },
      { path: '/shipper/reports', label: 'Reports', icon: 'chart' },
      { path: '/shipper/documents', label: 'Documents', icon: 'document' }
    ],
    CARRIER: [
      { path: '/carrier/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/carrier/loads', label: 'Available Loads', icon: 'truck' },
      { path: '/carrier/tracking', label: 'Tracking', icon: 'location' },
      { path: '/carrier/drivers', label: 'Drivers', icon: 'user' },
      { path: '/carrier/equipment', label: 'Equipment', icon: 'trailer' },
      { path: '/carrier/invoices', label: 'Invoices', icon: 'invoice' },
      { path: '/carrier/reports', label: 'Reports', icon: 'chart' },
      { path: '/carrier/documents', label: 'Documents', icon: 'document' }
    ]
  }
};

// Helper function to get config with fallback to BASE
export function getPageConfig(page: keyof RoleConfiguration, role: string): PageConfig {
  // Special handling for navigation
  if (page === 'navigation') {
    return {} as PageConfig; // Navigation is handled separately
  }
  
  const pageConfigs = roleConfig[page] as Record<string, PageConfig>;
  if (!pageConfigs) return {};
  
  // Merge BASE config with role-specific config
  const baseConfig = pageConfigs.BASE || {};
  const roleSpecificConfig = pageConfigs[role] || {};
  
  return {
    ...baseConfig,
    ...roleSpecificConfig,
    // Merge arrays properly
    fields: [...(baseConfig.fields || []), ...(roleSpecificConfig.fields || [])],
    actions: [...(baseConfig.actions || []), ...(roleSpecificConfig.actions || [])],
    columns: roleSpecificConfig.columns || baseConfig.columns,
    filters: roleSpecificConfig.filters || baseConfig.filters,
    widgets: roleSpecificConfig.widgets || baseConfig.widgets
  };
}

export default roleConfig;