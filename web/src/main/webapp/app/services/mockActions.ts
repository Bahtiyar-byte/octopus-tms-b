// Mock service for simulating actions and providing feedback
import { toast } from 'react-hot-toast';

// Simulated delay for actions
const simulateAction = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Toast notification helper
const notify = (message: string, type: 'success' | 'error' | 'loading' = 'success') => {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else {
    toast.loading(message);
  }
};

export interface Driver {
  id: string;
  name: string;
  phone: string;
  status: 'available' | 'in-transit' | 'off-duty';
  currentLoad?: string;
}

export interface LoadUpdate {
  id: string;
  status: 'Booked' | 'Assigned' | 'Picked Up' | 'Delivered';
  driver?: string;
  pickupDate?: string;
  deliveryDate?: string;
  eta?: string;
}

export interface InvoiceUpdate {
  id: string;
  invoiceNumber: string;
  status: 'paid' | 'unpaid' | 'overdue';
  paidDate?: string;
}

// Available drivers for assignment
const availableDrivers: Driver[] = [
  { id: 'D1001', name: 'John Smith', phone: '555-123-4567', status: 'available' },
  { id: 'D1002', name: 'Maria Garcia', phone: '555-234-5678', status: 'available' },
  { id: 'D1003', name: 'Robert Johnson', phone: '555-345-6789', status: 'available' },
  { id: 'D1004', name: 'Sarah Williams', phone: '555-456-7890', status: 'available' },
  { id: 'D1005', name: 'David Brown', phone: '555-567-8901', status: 'available' },
];

export const mockActions = {
  // Dispatching actions
  assignDriver: async (loadId: string, driverId: string): Promise<LoadUpdate> => {
    const driver = availableDrivers.find(d => d.id === driverId);
    
    if (!driver) {
      notify('Failed to assign driver: Driver not found', 'error');
      throw new Error('Driver not found');
    }
    
    const updatedLoad = {
      id: loadId,
      status: 'Assigned' as const,
      driver: driver.name
    };
    
    await simulateAction(updatedLoad);
    notify(`Successfully assigned ${driver.name} to load ${loadId}`);
    return updatedLoad;
  },
  
  getAvailableDrivers: async (): Promise<Driver[]> => {
    return simulateAction(availableDrivers);
  },
  
  markAsPickedUp: async (loadId: string): Promise<LoadUpdate> => {
    const today = new Date().toLocaleDateString();
    
    const updatedLoad = {
      id: loadId,
      status: 'Picked Up' as const,
      pickupDate: today,
      eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString() + ' 14:30'
    };
    
    await simulateAction(updatedLoad);
    notify(`Load ${loadId} has been picked up`);
    return updatedLoad;
  },
  
  markAsDelivered: async (loadId: string): Promise<LoadUpdate> => {
    const today = new Date().toLocaleDateString();
    
    const updatedLoad = {
      id: loadId,
      status: 'Delivered' as const,
      deliveryDate: today
    };
    
    await simulateAction(updatedLoad);
    notify(`Load ${loadId} has been delivered successfully`);
    return updatedLoad;
  },
  
  createInvoice: async (loadId: string): Promise<{ invoiceId: string; loadId: string }> => {
    const invoiceId = 'INV-' + Math.floor(10000 + Math.random() * 90000);
    
    await simulateAction({ invoiceId, loadId });
    notify(`Invoice ${invoiceId} created for load ${loadId}`);
    return { invoiceId, loadId };
  },
  
  createLoad: async (loadData: any): Promise<{ id: string }> => {
    const loadId = 'LD' + Math.floor(1000 + Math.random() * 9000);
    
    await simulateAction({ id: loadId });
    notify(`New load ${loadId} created successfully`);
    return { id: loadId };
  },
  
  editLoad: async (loadId: string, loadData: any): Promise<{ id: string }> => {
    await simulateAction({ id: loadId });
    notify(`Load ${loadId} updated successfully`);
    return { id: loadId };
  },
  
  duplicateLoad: async (loadId: string): Promise<{ id: string; originalId: string }> => {
    const newLoadId = 'LD' + Math.floor(1000 + Math.random() * 9000);
    
    await simulateAction({ id: newLoadId, originalId: loadId });
    notify(`Load ${loadId} duplicated as ${newLoadId}`);
    return { id: newLoadId, originalId: loadId };
  },

  // Document actions
  uploadDocument: async (file: File, relatedTo?: string): Promise<{ id: string; filename: string }> => {
    const documentId = 'DOC-' + Math.floor(10000 + Math.random() * 90000);
    
    await simulateAction({ id: documentId, filename: file.name });
    notify(`Document ${file.name} uploaded successfully`);
    return { id: documentId, filename: file.name };
  },
  
  downloadDocument: async (documentId: string): Promise<void> => {
    await simulateAction({});
    notify(`Document download started`);
  },
  
  // Tracking actions
  sendTrackingUpdate: async (loadId: string, message: string): Promise<void> => {
    await simulateAction({});
    notify(`Tracking update sent for load ${loadId}`);
  },
  
  // Invoice actions
  sendInvoice: async (invoiceId: string, email: string): Promise<void> => {
    await simulateAction({});
    notify(`Invoice ${invoiceId} sent to ${email}`);
  },
  
  markInvoiceAsPaid: async (invoiceId: string): Promise<InvoiceUpdate> => {
    const today = new Date().toLocaleDateString();
    
    const updatedInvoice = {
      id: invoiceId,
      invoiceNumber: invoiceId,
      status: 'paid' as const,
      paidDate: today
    };
    
    await simulateAction(updatedInvoice);
    notify(`Invoice ${invoiceId} marked as paid`);
    return updatedInvoice;
  },
  
  sendInvoiceReminder: async (invoiceId: string): Promise<void> => {
    await simulateAction({});
    notify(`Payment reminder sent for invoice ${invoiceId}`);
  },
  
  downloadInvoice: async (invoiceId: string): Promise<void> => {
    await simulateAction({});
    notify(`Invoice ${invoiceId} download started`);
  },

  syncWithQuickBooks: async (): Promise<void> => {
    await simulateAction({}, 1500);
    notify('Successfully synchronized with QuickBooks');
  },

  sendOverdueReminders: async (): Promise<void> => {
    await simulateAction({}, 1200);
    notify('Payment reminders sent to all overdue customers');
  },

  downloadInvoiceReport: async (): Promise<void> => {
    await simulateAction({}, 1000);
    notify('Invoice report downloaded successfully');
  },

  bulkUpdateInvoiceStatus: async (status: 'paid' | 'unpaid'): Promise<void> => {
    await simulateAction({}, 1500);
    notify(`Selected invoices marked as ${status}`);
  },
  
  // Reports
  generateReport: async (reportType: string, filters: any): Promise<{ reportId: string; url: string }> => {
    const reportId = 'RPT-' + Math.floor(10000 + Math.random() * 90000);
    
    await simulateAction({ reportId, url: `reports/${reportId}.pdf` });
    notify(`${reportType} report generated successfully`);
    return { reportId, url: `reports/${reportId}.pdf` };
  },
  
  // Settings
  saveSettings: async (settings: any): Promise<void> => {
    await simulateAction({});
    notify('Settings saved successfully');
  }
};

// Export the service functions and helper functions
export { notify };