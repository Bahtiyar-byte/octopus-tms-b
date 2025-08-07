import { ApiClient } from '../../../services/api';
import { Load } from '../pages/Loads/Loads';

// Response types
interface LoadDTO {
  id: string;
  loadNumber?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  commodity?: string;
  rate?: number;
  weight?: number;
  equipment?: string;
  pickupDate?: string;
  deliveryDate?: string;
  distance?: number;
  carrierId?: string;
  carrierName?: string;
  customerId?: string;
  customerName?: string;
  driverName?: string;
}

interface LoadListResponse {
  content: LoadDTO[];
  totalElements: number;
  totalPages: number;
}

// API functions
export const loadsApi = {
  /**
   * Get all loads
   * @param status Optional status filter
   * @returns Array of loads
   */
  getLoads: async (status?: string): Promise<Load[]> => {
    try {
      const response = await ApiClient.get<LoadListResponse>('/loads');
      
      // Map backend DTO to frontend Load type
      const loads = response.content.map((loadDTO: LoadDTO) => ({
        id: loadDTO.id || loadDTO.loadNumber || '',
        origin: `${loadDTO.originCity}, ${loadDTO.originState}`,
        destination: `${loadDTO.destinationCity}, ${loadDTO.destinationState}`,
        status: loadDTO.status.toLowerCase().replace(' ', '_'),
        createdAt: loadDTO.createdAt,
        updatedAt: loadDTO.updatedAt,
        commodity: loadDTO.commodity || 'General Freight',
        rate: loadDTO.rate || 0,
        weight: loadDTO.weight || 0,
        equipment: loadDTO.equipment,
        pickupDate: loadDTO.pickupDate,
        deliveryDate: loadDTO.deliveryDate,
        distance: loadDTO.distance,
        loadNumber: loadDTO.loadNumber,
        carrier: loadDTO.carrierId ? {
          id: loadDTO.carrierId,
          name: loadDTO.carrierName || 'Unknown Carrier'
        } : undefined,
        customer: loadDTO.customerId ? {
          id: loadDTO.customerId,
          name: loadDTO.customerName || 'Unknown Customer'
        } : undefined,
        driver: loadDTO.driverName
      }));

      if (status) {
        return loads.filter((load: Load) => load.status === status);
      }
      
      return loads;
    } catch (error) {
      console.error('Error fetching loads:', error);
      // Return empty array on error
      return [];
    }
  },

  /**
   * Get a single load by ID
   * @param id Load ID
   * @returns Load object
   */
  getLoad: async (id: string): Promise<Load | null> => {
    try {
      const loadDTO = await ApiClient.get<LoadDTO>(`/loads/${id}`);
      
      return {
        id: loadDTO.id || loadDTO.loadNumber || '',
        origin: `${loadDTO.originCity}, ${loadDTO.originState}`,
        destination: `${loadDTO.destinationCity}, ${loadDTO.destinationState}`,
        status: loadDTO.status.toLowerCase().replace(' ', '_'),
        createdAt: loadDTO.createdAt,
        updatedAt: loadDTO.updatedAt,
        commodity: loadDTO.commodity || 'General Freight',
        rate: loadDTO.rate || 0,
        weight: loadDTO.weight || 0,
        equipment: loadDTO.equipment,
        pickupDate: loadDTO.pickupDate,
        deliveryDate: loadDTO.deliveryDate,
        distance: loadDTO.distance,
        carrier: loadDTO.carrierId ? {
          id: loadDTO.carrierId,
          name: loadDTO.carrierName || 'Unknown Carrier'
        } : undefined,
        customer: loadDTO.customerId ? {
          id: loadDTO.customerId,
          name: loadDTO.customerName || 'Unknown Customer'
        } : undefined,
        driver: loadDTO.driverName
      };
    } catch (error) {
      console.error('Error fetching load:', error);
      return null;
    }
  }
};

export default loadsApi;