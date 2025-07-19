import { ApiClient } from '../../../services/api';

// Types
export interface BrokerMetrics {
  openLoads: number;
  pendingPayments: number;
  postedLoads: number;
  assignedLoads: number;
  deliveredLoads: number;
  totalRevenue: number;
}

export interface Load {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  commodity: string;
  weight: number;
  rate: number;
  status: 'draft' | 'posted' | 'assigned' | 'en_route' | 'delivered' | 'awaiting_docs' | 'paid';
  notes?: string;
  carrier?: {
    id: string;
    name: string;
    contact: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Carrier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  rating: number;
  availableEquipment: string[];
  preferredLanes: {
    origin: string;
    destination: string;
  }[];
}

export interface Contract {
  id: string;
  carrierId: string;
  carrierName: string;
  status: 'pending' | 'signed';
  createdAt: string;
  expiresAt: string;
  documentUrl: string;
}

export interface Payment {
  id: string;
  loadId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  dueDate: string;
  createdAt: string;
}

export interface Document {
  id: string;
  loadId: string;
  type: 'bol' | 'pod' | 'invoice' | 'other';
  name: string;
  uploadedAt: string;
  url: string;
}

// DTO types from backend
interface LoadDTO {
  loadNumber: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  distance?: number;
  commodity?: string;
  weight?: number;
  rate?: number;
  status: string;
  notes?: string;
  specialInstructions?: string;
  carrierId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Response types
interface LoadListResponse {
  content: LoadDTO[];
  totalElements: number;
  totalPages: number;
}

// API functions
export const brokerApi = {
  // Dashboard metrics
  getDashboardMetrics: async (): Promise<BrokerMetrics> => {
    return await ApiClient.get<BrokerMetrics>('/broker/metrics');
  },

  // Loads
  getLoads: async (status?: string): Promise<Load[]> => {
    try {
      // Hard-coded broker ID for now - in a real app, this would come from auth context
      const brokerId = 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890';
      const response = await ApiClient.get<LoadListResponse>(`/loads/broker/${brokerId}`);

      // Map backend DTO to frontend Load type
      const loads = response.content.map((loadDTO: LoadDTO) => ({
        id: loadDTO.loadNumber,
        origin: `${loadDTO.originCity}, ${loadDTO.originState}`,
        destination: `${loadDTO.destinationCity}, ${loadDTO.destinationState}`,
        distance: loadDTO.distance || 0,
        commodity: loadDTO.commodity || 'General Freight',
        weight: loadDTO.weight || 0,
        rate: loadDTO.rate || 0,
        status: loadDTO.status.toLowerCase().replace(' ', '_') as Load['status'],
        notes: loadDTO.notes || loadDTO.specialInstructions,
        carrier: loadDTO.carrierId ? {
          id: loadDTO.carrierId,
          name: 'Carrier information not available',
          contact: 'Unknown',
          phone: 'Unknown'
        } : undefined,
        createdAt: loadDTO.createdAt || new Date().toISOString(),
        updatedAt: loadDTO.updatedAt || new Date().toISOString()
      }));

      if (status) {
        return loads.filter((load: Load) => load.status === status);
      }
      return loads;
    } catch (error) {
      // Return empty array on error
      return [];
    }
  },

  getLoad: async (id: string): Promise<Load> => {
    return await ApiClient.get<Load>(`/loads/${id}`);
  },

  createLoad: async (loadData: Partial<Load>): Promise<Load> => {
    return await ApiClient.post<Load>('/loads', loadData);
  },

  updateLoadStatus: async (id: string, status: Load['status']): Promise<Load> => {
    return await ApiClient.patch<Load>(`/loads/${id}/status`, { status });
  },

  // Carriers
  getAvailableCarriers: async (): Promise<Carrier[]> => {
    return await ApiClient.get<Carrier[]>('/carriers/available');
  },

  // Contracts
  getContracts: async (): Promise<Contract[]> => {
    return await ApiClient.get<Contract[]>('/contracts');
  },

  // Payments
  getPayments: async (): Promise<Payment[]> => {
    return await ApiClient.get<Payment[]>('/payments');
  },

  // Documents
  getDocuments: async (loadId?: string): Promise<Document[]> => {
    if (loadId) {
      return await ApiClient.get<Document[]>(`/documents?loadId=${loadId}`);
    }
    return await ApiClient.get<Document[]>('/documents');
  }
};

export default brokerApi;