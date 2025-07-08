// Carrier API module - centralized API functions for carrier operations
import { api } from '../../../services/api';

// Mock data for carrier operations
const mockLoads = [
  {
    id: 'LD001',
    origin: 'New York, NY',
    destination: 'Chicago, IL',
    rate: 2500,
    equipmentType: 'Dry Van',
    pickupDate: '2025-05-20',
    deliveryDate: '2025-05-22',
    broker: 'CH Robinson',
    contact: 'John Doe (555-1234)'
  }
];

const mockDrivers = [
  {
    id: 'D001',
    name: 'John Smith',
    truck: 'Truck 01',
    status: 'Available',
    location: 'New York, NY',
    hours: '8/14',
    nextAvailable: 'Now'
  }
];

const mockDocuments = [
  {
    id: 'DOC001',
    name: 'Rate Confirmation - LD001',
    type: 'rate_confirmation',
    uploadDate: '2025-05-20',
    size: '1.2 MB',
    status: 'active'
  }
];

const mockInvoices = [
  {
    id: 'INV001',
    loadId: 'LD001',
    amount: 2500,
    status: 'pending',
    dueDate: '2025-06-20'
  }
];

// Simulated API service with artificial delay to mimic real API calls
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Carrier-specific API functions
export const carrierApi = {
  // Dashboard
  getDashboardData: api.getDashboardData,
  
  // Loads
  getLoads: () => simulateApiCall(mockLoads),
  searchLoads: (params: any) => simulateApiCall(mockLoads),
  getLoadDetails: (id: string) => simulateApiCall(mockLoads[0]),
  getAllLoads: () => simulateApiCall(mockLoads),
  
  // Dispatch
  getDispatchData: () => simulateApiCall({ loads: mockLoads, drivers: mockDrivers }),
  assignDriver: (loadId: string, driverId: string) => simulateApiCall({ success: true }),
  
  // Drivers
  getDrivers: () => simulateApiCall(mockDrivers),
  getDriverPerformance: api.getDriverPerformance,
  
  // Documents
  getDocuments: () => simulateApiCall(mockDocuments),
  uploadDocument: (doc: any) => simulateApiCall({ success: true, document: doc }),
  
  // Tracking
  getTrackingData: () => simulateApiCall({ shipments: mockLoads }),
  getShipmentDetails: (id: string) => simulateApiCall(mockLoads[0]),
  
  // Invoices
  getInvoices: () => simulateApiCall(mockInvoices),
  generateInvoice: (loadId: string) => simulateApiCall({ success: true, invoiceId: 'INV-' + Math.random() }),
  
  // Reports
  getReports: () => simulateApiCall([]),
  generateReport: (type: string) => simulateApiCall({ success: true, reportId: 'REP-' + Math.random() }),
};

export default carrierApi;