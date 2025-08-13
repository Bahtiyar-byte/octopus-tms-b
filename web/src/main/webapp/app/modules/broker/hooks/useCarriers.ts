import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Carrier {
  id: string;
  name: string;
  mc: string;
  dot: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  equipment: string[];
  lanes: { origin: string; destination: string }[];
  rating: number;
  totalLoads: number;
  onTimePercentage: number;
  insurance: {
    liability: number;
    cargo: number;
    expiresAt: string;
  };
  lastLoadDate: string;
}

// Mock data
const mockCarriers: Carrier[] = [
  {
    id: 'CAR001',
    name: 'Swift Transportation',
    mc: '123456',
    dot: '1234567',
    contact: 'John Williams',
    email: 'dispatch@swift.com',
    phone: '+1 (555) 111-2222',
    address: '2200 S 75th Ave, Phoenix, AZ 85043',
    status: 'Active',
    equipment: ['Dry Van', 'Reefer'],
    lanes: [
      { origin: 'Chicago, IL', destination: 'New York, NY' },
      { origin: 'Los Angeles, CA', destination: 'Dallas, TX' },
      { origin: 'Atlanta, GA', destination: 'Miami, FL' },
    ],
    rating: 4.8,
    totalLoads: 156,
    onTimePercentage: 94,
    insurance: {
      liability: 1000000,
      cargo: 250000,
      expiresAt: '2025-12-31',
    },
    lastLoadDate: '2025-01-24',
  },
  {
    id: 'CAR002',
    name: 'J.B. Hunt',
    mc: '234567',
    dot: '2345678',
    contact: 'Sarah Miller',
    email: 'carrier.services@jbhunt.com',
    phone: '+1 (555) 222-3333',
    address: '615 JB Hunt Dr, Lowell, AR 72745',
    status: 'Active',
    equipment: ['Dry Van', 'Flatbed', 'Reefer'],
    lanes: [
      { origin: 'Dallas, TX', destination: 'Houston, TX' },
      { origin: 'Phoenix, AZ', destination: 'Las Vegas, NV' },
    ],
    rating: 4.7,
    totalLoads: 142,
    onTimePercentage: 92,
    insurance: {
      liability: 1000000,
      cargo: 300000,
      expiresAt: '2025-11-30',
    },
    lastLoadDate: '2025-01-23',
  },
  {
    id: 'CAR003',
    name: 'Knight Transportation',
    mc: '345678',
    dot: '3456789',
    contact: 'Mike Johnson',
    email: 'dispatch@knighttrans.com',
    phone: '+1 (555) 333-4444',
    address: '20002 N 19th Ave, Phoenix, AZ 85027',
    status: 'Active',
    equipment: ['Dry Van', 'Reefer', 'Tanker'],
    lanes: [
      { origin: 'Seattle, WA', destination: 'Portland, OR' },
      { origin: 'San Francisco, CA', destination: 'Los Angeles, CA' },
      { origin: 'Denver, CO', destination: 'Salt Lake City, UT' },
      { origin: 'Chicago, IL', destination: 'Detroit, MI' },
    ],
    rating: 4.9,
    totalLoads: 128,
    onTimePercentage: 96,
    insurance: {
      liability: 2000000,
      cargo: 500000,
      expiresAt: '2025-10-15',
    },
    lastLoadDate: '2025-01-22',
  },
  {
    id: 'CAR004',
    name: 'Schneider National',
    mc: '456789',
    dot: '4567890',
    contact: 'Lisa Brown',
    email: 'carrier@schneider.com',
    phone: '+1 (555) 444-5555',
    address: '3101 S Packerland Dr, Green Bay, WI 54313',
    status: 'Pending',
    equipment: ['Dry Van', 'Flatbed'],
    lanes: [
      { origin: 'Milwaukee, WI', destination: 'Chicago, IL' },
      { origin: 'Minneapolis, MN', destination: 'Des Moines, IA' },
    ],
    rating: 4.6,
    totalLoads: 115,
    onTimePercentage: 91,
    insurance: {
      liability: 1000000,
      cargo: 250000,
      expiresAt: '2025-09-30',
    },
    lastLoadDate: '2025-01-20',
  },
  {
    id: 'CAR005',
    name: 'Werner Enterprises',
    mc: '567890',
    dot: '5678901',
    contact: 'David Wilson',
    email: 'dispatch@werner.com',
    phone: '+1 (555) 555-6666',
    address: '14507 Frontier Rd, Omaha, NE 68138',
    status: 'Inactive',
    equipment: ['Dry Van', 'Reefer', 'Flatbed'],
    lanes: [
      { origin: 'Omaha, NE', destination: 'Kansas City, MO' },
    ],
    rating: 4.5,
    totalLoads: 98,
    onTimePercentage: 89,
    insurance: {
      liability: 1000000,
      cargo: 200000,
      expiresAt: '2025-08-31',
    },
    lastLoadDate: '2024-12-15',
  },
];

export const useCarriers = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCarriers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCarriers(mockCarriers);
    } catch (error) {
      toast.error('Failed to load carriers');
    } finally {
      setLoading(false);
    }
  };

  interface CarrierFormData {
    name: string;
    mc: string;
    dot: string;
    contact: string;
    email: string;
    phone: string;
    address?: string;
    equipment: string[];
  }

  const addCarrier = async (carrierData: CarrierFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCarrier: Carrier = {
        id: `CAR${String(carriers.length + 1).padStart(3, '0')}`,
        name: carrierData.name,
        mc: carrierData.mc,
        dot: carrierData.dot,
        contact: carrierData.contact,
        email: carrierData.email,
        phone: carrierData.phone,
        address: carrierData.address || '',
        status: 'Pending',
        equipment: carrierData.equipment,
        lanes: [],
        rating: 0,
        totalLoads: 0,
        onTimePercentage: 0,
        insurance: {
          liability: 0,
          cargo: 0,
          expiresAt: '',
        },
        lastLoadDate: '',
      };
      
      setCarriers([...carriers, newCarrier]);
      return newCarrier;
    } catch (error) {
      throw error;
    }
  };

  const updateCarrier = async (id: string, updates: Partial<Carrier>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCarriers(carriers.map(carrier => 
        carrier.id === id ? { ...carrier, ...updates } : carrier
      ));
    } catch (error) {
      throw error;
    }
  };

  const deleteCarrier = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCarriers(carriers.filter(carrier => carrier.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const verifyCarrier = async (id: string) => {
    try {
      // Simulate API call to verify carrier credentials
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update carrier status to Active after verification
      setCarriers(carriers.map(carrier => 
        carrier.id === id ? { ...carrier, status: 'Active' } : carrier
      ));
      
      toast.success('Carrier verified successfully!');
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  return {
    carriers,
    loading,
    addCarrier,
    updateCarrier,
    deleteCarrier,
    verifyCarrier,
    refreshCarriers: fetchCarriers,
  };
};