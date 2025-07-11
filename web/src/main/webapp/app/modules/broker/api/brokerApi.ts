import axios from 'axios';

// Mock API for broker module
const API_DELAY = 500; // Simulate network delay

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

// Mock data
const mockLoads: Load[] = [
  {
    id: 'L1001',
    origin: 'Chicago, IL',
    destination: 'Dallas, TX',
    distance: 925,
    commodity: 'Electronics',
    weight: 15000,
    rate: 2200,
    status: 'posted',
    notes: 'Fragile items, handle with care',
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2023-11-01T10:00:00Z'
  },
  {
    id: 'L1002',
    origin: 'Atlanta, GA',
    destination: 'Miami, FL',
    distance: 662,
    commodity: 'Produce',
    weight: 22000,
    rate: 1800,
    status: 'assigned',
    carrier: {
      id: 'C2001',
      name: 'FastTrack Logistics',
      contact: 'John Smith',
      phone: '555-123-4567'
    },
    notes: 'Temperature controlled',
    createdAt: '2023-11-02T09:30:00Z',
    updatedAt: '2023-11-02T14:15:00Z'
  },
  {
    id: 'L1003',
    origin: 'Los Angeles, CA',
    destination: 'Phoenix, AZ',
    distance: 373,
    commodity: 'Furniture',
    weight: 18000,
    rate: 1500,
    status: 'en_route',
    carrier: {
      id: 'C2002',
      name: 'Western Transport',
      contact: 'Maria Garcia',
      phone: '555-987-6543'
    },
    createdAt: '2023-11-03T08:45:00Z',
    updatedAt: '2023-11-03T16:20:00Z'
  },
  {
    id: 'L1004',
    origin: 'New York, NY',
    destination: 'Boston, MA',
    distance: 215,
    commodity: 'Clothing',
    weight: 12000,
    rate: 1200,
    status: 'delivered',
    carrier: {
      id: 'C2003',
      name: 'East Coast Carriers',
      contact: 'Robert Johnson',
      phone: '555-456-7890'
    },
    createdAt: '2023-11-04T11:15:00Z',
    updatedAt: '2023-11-05T09:30:00Z'
  },
  {
    id: 'L1005',
    origin: 'Seattle, WA',
    destination: 'Portland, OR',
    distance: 174,
    commodity: 'Machinery',
    weight: 25000,
    rate: 1350,
    status: 'awaiting_docs',
    carrier: {
      id: 'C2004',
      name: 'Pacific Northwest Logistics',
      contact: 'Sarah Wilson',
      phone: '555-789-0123'
    },
    createdAt: '2023-11-05T13:00:00Z',
    updatedAt: '2023-11-06T10:45:00Z'
  }
];

// API functions
export const brokerApi = {
  // Dashboard metrics
  getDashboardMetrics: async (): Promise<BrokerMetrics> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    return {
      openLoads: 12,
      pendingPayments: 5,
      postedLoads: 8,
      assignedLoads: 15,
      deliveredLoads: 23,
      totalRevenue: 45600
    };
  },

  // Loads
  getLoads: async (status?: string): Promise<Load[]> => {
    try {
      // Hard-coded broker ID for now - in a real app, this would come from auth context
      const brokerId = 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890';
      const response = await axios.get(`/api/loads/broker/${brokerId}`);

      // Map backend DTO to frontend Load type
      const loads = response.data.content.map((loadDTO: any) => ({
        id: loadDTO.loadNumber,
        origin: `${loadDTO.originCity}, ${loadDTO.originState}`,
        destination: `${loadDTO.destinationCity}, ${loadDTO.destinationState}`,
        distance: loadDTO.distance || 0,
        commodity: loadDTO.commodity || 'General Freight',
        weight: loadDTO.weight || 0,
        rate: loadDTO.rate || 0,
        status: loadDTO.status.toLowerCase().replace(' ', '_') as any,
        notes: loadDTO.notes || loadDTO.specialInstructions,
        carrier: loadDTO.carrierId ? {
          id: loadDTO.carrierId,
          name: 'Carrier information not available', // We would need another API call to get carrier details
          contact: 'Unknown',
          phone: 'Unknown'
        } : undefined,
        createdAt: loadDTO.createdAt || new Date().toISOString(),
        updatedAt: loadDTO.updatedAt || new Date().toISOString()
      }));

      if (status) {
        return loads.filter((load: any) => load.status === status);
      }
      return loads;
    } catch (error) {
      console.error('Error fetching loads:', error);
      // Fall back to mock data if API call fails
      if (status) {
        return mockLoads.filter(load => load.status === status);
      }
      return mockLoads;
    }
  },

  getLoad: async (id: string): Promise<Load> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    const load = mockLoads.find(load => load.id === id);
    if (!load) {
      throw new Error('Load not found');
    }
    return load;
  },

  createLoad: async (loadData: Partial<Load>): Promise<Load> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    const newLoad: Load = {
      id: `L${Math.floor(1000 + Math.random() * 9000)}`,
      origin: loadData.origin || '',
      destination: loadData.destination || '',
      distance: loadData.distance || 0,
      commodity: loadData.commodity || '',
      weight: loadData.weight || 0,
      rate: loadData.rate || 0,
      status: 'draft',
      notes: loadData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newLoad;
  },

  updateLoadStatus: async (id: string, status: Load['status']): Promise<Load> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    const loadIndex = mockLoads.findIndex(load => load.id === id);
    if (loadIndex === -1) {
      throw new Error('Load not found');
    }

    const updatedLoad = {
      ...mockLoads[loadIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    return updatedLoad;
  },

  // Carriers
  getAvailableCarriers: async (): Promise<Carrier[]> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    return [
      {
        id: 'C2001',
        name: 'FastTrack Logistics',
        contact: 'John Smith',
        phone: '555-123-4567',
        email: 'john@fasttrack.com',
        rating: 4.8,
        availableEquipment: ['Dry Van', 'Reefer'],
        preferredLanes: [
          { origin: 'Chicago, IL', destination: 'Dallas, TX' },
          { origin: 'Atlanta, GA', destination: 'Miami, FL' }
        ]
      },
      {
        id: 'C2002',
        name: 'Western Transport',
        contact: 'Maria Garcia',
        phone: '555-987-6543',
        email: 'maria@westerntransport.com',
        rating: 4.5,
        availableEquipment: ['Flatbed', 'Step Deck'],
        preferredLanes: [
          { origin: 'Los Angeles, CA', destination: 'Phoenix, AZ' },
          { origin: 'Seattle, WA', destination: 'Portland, OR' }
        ]
      },
      {
        id: 'C2003',
        name: 'East Coast Carriers',
        contact: 'Robert Johnson',
        phone: '555-456-7890',
        email: 'robert@eastcoastcarriers.com',
        rating: 4.2,
        availableEquipment: ['Dry Van'],
        preferredLanes: [
          { origin: 'New York, NY', destination: 'Boston, MA' },
          { origin: 'Philadelphia, PA', destination: 'Washington, DC' }
        ]
      }
    ];
  },

  // Contracts
  getContracts: async (): Promise<Contract[]> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    return [
      {
        id: 'CT1001',
        carrierId: 'C2001',
        carrierName: 'FastTrack Logistics',
        status: 'signed',
        createdAt: '2023-10-15T10:00:00Z',
        expiresAt: '2024-10-15T10:00:00Z',
        documentUrl: '/documents/contracts/CT1001.pdf'
      },
      {
        id: 'CT1002',
        carrierId: 'C2002',
        carrierName: 'Western Transport',
        status: 'pending',
        createdAt: '2023-11-01T09:30:00Z',
        expiresAt: '2024-11-01T09:30:00Z',
        documentUrl: '/documents/contracts/CT1002.pdf'
      }
    ];
  },

  // Payments
  getPayments: async (): Promise<Payment[]> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    return [
      {
        id: 'P1001',
        loadId: 'L1002',
        amount: 1800,
        status: 'pending',
        dueDate: '2023-12-01T00:00:00Z',
        createdAt: '2023-11-05T14:30:00Z'
      },
      {
        id: 'P1002',
        loadId: 'L1003',
        amount: 1500,
        status: 'approved',
        dueDate: '2023-11-25T00:00:00Z',
        createdAt: '2023-11-06T11:45:00Z'
      },
      {
        id: 'P1003',
        loadId: 'L1004',
        amount: 1200,
        status: 'paid',
        dueDate: '2023-11-15T00:00:00Z',
        createdAt: '2023-11-01T09:15:00Z'
      }
    ];
  },

  // Documents
  getDocuments: async (loadId?: string): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));

    const documents = [
      {
        id: 'D1001',
        loadId: 'L1004',
        type: 'bol' as const,
        name: 'BOL_L1004.pdf',
        uploadedAt: '2023-11-04T12:30:00Z',
        url: '/documents/bol/BOL_L1004.pdf'
      },
      {
        id: 'D1002',
        loadId: 'L1004',
        type: 'pod' as const,
        name: 'POD_L1004.pdf',
        uploadedAt: '2023-11-05T10:15:00Z',
        url: '/documents/pod/POD_L1004.pdf'
      },
      {
        id: 'D1003',
        loadId: 'L1005',
        type: 'bol' as const,
        name: 'BOL_L1005.pdf',
        uploadedAt: '2023-11-05T14:45:00Z',
        url: '/documents/bol/BOL_L1005.pdf'
      }
    ];

    if (loadId) {
      return documents.filter(doc => doc.loadId === loadId);
    }
    return documents;
  }
};

export default brokerApi;
