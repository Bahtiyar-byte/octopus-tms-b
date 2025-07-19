// Role-based configuration for UniversalDocuments component
export interface DocumentConfig {
  allowedTypes: string[];
  documentPrefix: string;
  visibleColumns: string[];
  enablePreview: boolean;
  enableUpload: boolean;
  enableDelete: boolean;
  enableShare: boolean;
  enablePrint: boolean;
  customActions?: CustomAction[];
  apiEndpoint: string;
  pageSize: number;
  showQuickAccess: boolean;
  showStorageIndicator: boolean;
  showRelatedDocuments: boolean;
  showDocumentHistory: boolean;
  documentCategories: DocumentCategory[];
  storageQuota?: number; // in GB
}

// Import Document type for proper typing
interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  previewUrl?: string;
  isImage?: boolean;
  loadId?: string;
  status?: string;
  uploadedBy?: string;
  warehouse?: string;
  expiryDate?: string;
}

export interface CustomAction {
  name: string;
  icon: string;
  handler: (doc: Document) => void;
  condition?: (doc: Document) => boolean;
}

export interface DocumentCategory {
  key: string;
  label: string;
  icon: string;
  color: string;
  count?: number;
}

// Document type definitions
export const DOCUMENT_TYPES = {
  RATE_CONFIRMATION: 'rate_confirmation',
  BOL: 'bol',
  POD: 'pod',
  INVOICE: 'invoice',
  OTHER: 'other',
  LUMPER_RECEIPT: 'lumper_receipt',
  WAREHOUSE_CERT: 'warehouse_cert'
} as const;

// Role-specific configurations
export const DOCUMENT_CONFIGS: Record<string, DocumentConfig> = {
  BROKER: {
    allowedTypes: ['PDF', 'DOC', 'XLS', 'PNG', 'JPG'],
    documentPrefix: 'BL-',
    visibleColumns: ['name', 'type', 'loadId', 'uploadDate', 'status', 'uploadedBy'],
    enablePreview: true,
    enableUpload: true,
    enableDelete: true,
    enableShare: true,
    enablePrint: true,
    customActions: [
      {
        name: 'Email',
        icon: 'fa-envelope',
        handler: (doc) => { 
          // Email document handler implementation
          console.log('Email document:', doc.id);
        }
      }
    ],
    apiEndpoint: '/api/broker/documents',
    pageSize: 20,
    showQuickAccess: true,
    showStorageIndicator: true,
    showRelatedDocuments: true,
    showDocumentHistory: true,
    documentCategories: [
      { key: DOCUMENT_TYPES.RATE_CONFIRMATION, label: 'Rate Confirmations', icon: 'fa-file-contract', color: 'blue' },
      { key: DOCUMENT_TYPES.BOL, label: 'Bills of Lading', icon: 'fa-file-invoice', color: 'green' },
      { key: DOCUMENT_TYPES.POD, label: 'Proofs of Delivery', icon: 'fa-clipboard-check', color: 'purple' },
      { key: DOCUMENT_TYPES.INVOICE, label: 'Invoices', icon: 'fa-file-invoice-dollar', color: 'orange' },
      { key: DOCUMENT_TYPES.OTHER, label: 'Other Documents', icon: 'fa-file', color: 'gray' }
    ],
    storageQuota: 10
  },
  
  CARRIER: {
    allowedTypes: ['PDF', 'PNG', 'JPG'],
    documentPrefix: 'CD-',
    visibleColumns: ['name', 'type', 'date', 'size'],
    enablePreview: true,
    enableUpload: true,
    enableDelete: false, // Carriers can't delete documents
    enableShare: true,
    enablePrint: true,
    customActions: [
      {
        name: 'Download',
        icon: 'fa-download',
        handler: (doc) => { 
          // Download document handler implementation
          console.log('Download document:', doc.id);
        }
      }
    ],
    apiEndpoint: '/api/carrier/documents',
    pageSize: 15,
    showQuickAccess: true,
    showStorageIndicator: true,
    showRelatedDocuments: true,
    showDocumentHistory: true,
    documentCategories: [
      { key: DOCUMENT_TYPES.RATE_CONFIRMATION, label: 'Rate Confirmations', icon: 'fa-file-contract', color: 'blue' },
      { key: DOCUMENT_TYPES.BOL, label: 'Bills of Lading', icon: 'fa-file-invoice', color: 'green' },
      { key: DOCUMENT_TYPES.POD, label: 'Proofs of Delivery', icon: 'fa-clipboard-check', color: 'purple' }
    ],
    storageQuota: 10
  },
  
  SHIPPER: {
    allowedTypes: ['PDF', 'DOC', 'XLS'],
    documentPrefix: 'SD-',
    visibleColumns: ['name', 'type', 'warehouse', 'uploadDate', 'expiryDate'],
    enablePreview: true,
    enableUpload: true,
    enableDelete: true,
    enableShare: false, // Shippers might not share external documents
    enablePrint: true,
    customActions: [
      {
        name: 'Archive',
        icon: 'fa-archive',
        handler: (doc) => { 
          // Archive document handler implementation
          console.log('Archive document:', doc.id);
        },
        condition: (doc) => doc.status !== 'ARCHIVED'
      }
    ],
    apiEndpoint: '/api/shipper/documents',
    pageSize: 25,
    showQuickAccess: true,
    showStorageIndicator: true,
    showRelatedDocuments: false, // Shippers might not need related docs
    showDocumentHistory: true,
    documentCategories: [
      { key: DOCUMENT_TYPES.BOL, label: 'Bills of Lading', icon: 'fa-file-invoice', color: 'green' },
      { key: DOCUMENT_TYPES.WAREHOUSE_CERT, label: 'Warehouse Certificates', icon: 'fa-warehouse', color: 'indigo' },
      { key: DOCUMENT_TYPES.INVOICE, label: 'Invoices', icon: 'fa-file-invoice-dollar', color: 'orange' },
      { key: DOCUMENT_TYPES.OTHER, label: 'Other Documents', icon: 'fa-file', color: 'gray' }
    ],
    storageQuota: 15 // Shippers might need more storage
  }
};

// Helper functions
export const getDocTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    [DOCUMENT_TYPES.RATE_CONFIRMATION]: 'Rate Confirmation',
    [DOCUMENT_TYPES.BOL]: 'Bill of Lading',
    [DOCUMENT_TYPES.POD]: 'Proof of Delivery',
    [DOCUMENT_TYPES.INVOICE]: 'Invoice',
    [DOCUMENT_TYPES.LUMPER_RECEIPT]: 'Lumper Receipt',
    [DOCUMENT_TYPES.WAREHOUSE_CERT]: 'Warehouse Certificate',
    [DOCUMENT_TYPES.OTHER]: 'Other'
  };
  return labels[type] || type;
};

export const getDocTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    [DOCUMENT_TYPES.RATE_CONFIRMATION]: 'fa-file-contract',
    [DOCUMENT_TYPES.BOL]: 'fa-file-invoice',
    [DOCUMENT_TYPES.POD]: 'fa-clipboard-check',
    [DOCUMENT_TYPES.INVOICE]: 'fa-file-invoice-dollar',
    [DOCUMENT_TYPES.LUMPER_RECEIPT]: 'fa-receipt',
    [DOCUMENT_TYPES.WAREHOUSE_CERT]: 'fa-warehouse',
    [DOCUMENT_TYPES.OTHER]: 'fa-file'
  };
  return icons[type] || 'fa-file';
};

export const getDocTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    [DOCUMENT_TYPES.RATE_CONFIRMATION]: 'blue',
    [DOCUMENT_TYPES.BOL]: 'green',
    [DOCUMENT_TYPES.POD]: 'purple',
    [DOCUMENT_TYPES.INVOICE]: 'orange',
    [DOCUMENT_TYPES.LUMPER_RECEIPT]: 'yellow',
    [DOCUMENT_TYPES.WAREHOUSE_CERT]: 'indigo',
    [DOCUMENT_TYPES.OTHER]: 'gray'
  };
  return colors[type] || 'gray';
};

// Get configuration for current user role
export const getDocumentConfig = (role: string): DocumentConfig => {
  return DOCUMENT_CONFIGS[role] || DOCUMENT_CONFIGS.BROKER;
};