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
   * Get all loads with optional filters
   * @param status Optional status filter
   * @param search Optional search term
   * @returns Array of loads
   */
  getLoads: async (status?: string, search?: string): Promise<Load[]> => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (status && status !== 'all') {
        params.append('filter', status);
      }
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const queryString = params.toString();
      const url = queryString ? `/loads?${queryString}` : '/loads';
      
      const response = await ApiClient.get<LoadListResponse>(url);
      
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

      // No need to filter on frontend anymore since backend handles it
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