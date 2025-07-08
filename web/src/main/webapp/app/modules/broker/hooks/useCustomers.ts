import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending';
  totalLoads: number;
  totalRevenue: number;
  creditLimit: number;
  creditUsed: number;
  paymentTerms: string;
  lastLoadDate: string;
  rating: number;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'ABC Manufacturing',
    contact: 'John Smith',
    email: 'john.smith@abcmfg.com',
    phone: '+1 (555) 123-4567',
    address: '123 Industrial Way, Chicago, IL 60601',
    status: 'Active',
    totalLoads: 142,
    totalRevenue: 385000,
    creditLimit: 100000,
    creditUsed: 45000,
    paymentTerms: '30',
    lastLoadDate: '2025-01-24',
    rating: 5,
  },
  {
    id: 'CUST002',
    name: 'XYZ Distribution',
    contact: 'Sarah Johnson',
    email: 'sarah@xyzdist.com',
    phone: '+1 (555) 234-5678',
    address: '456 Commerce Blvd, Dallas, TX 75201',
    status: 'Active',
    totalLoads: 98,
    totalRevenue: 312000,
    creditLimit: 75000,
    creditUsed: 62000,
    paymentTerms: '45',
    lastLoadDate: '2025-01-23',
    rating: 4,
  },
  {
    id: 'CUST003',
    name: 'Global Logistics Inc',
    contact: 'Mike Davis',
    email: 'mdavis@globallogistics.com',
    phone: '+1 (555) 345-6789',
    address: '789 Shipping Lane, Atlanta, GA 30301',
    status: 'Active',
    totalLoads: 87,
    totalRevenue: 298000,
    creditLimit: 50000,
    creditUsed: 18000,
    paymentTerms: '30',
    lastLoadDate: '2025-01-22',
    rating: 5,
  },
  {
    id: 'CUST004',
    name: 'Prime Shipping Co',
    contact: 'Emily Chen',
    email: 'echen@primeshipping.com',
    phone: '+1 (555) 456-7890',
    address: '321 Port Drive, Los Angeles, CA 90001',
    status: 'Pending',
    totalLoads: 92,
    totalRevenue: 275000,
    creditLimit: 80000,
    creditUsed: 5000,
    paymentTerms: '15',
    lastLoadDate: '2025-01-20',
    rating: 4,
  },
  {
    id: 'CUST005',
    name: 'Fast Freight Ltd',
    contact: 'Robert Wilson',
    email: 'rwilson@fastfreight.com',
    phone: '+1 (555) 567-8901',
    address: '654 Express Way, Phoenix, AZ 85001',
    status: 'Inactive',
    totalLoads: 76,
    totalRevenue: 243000,
    creditLimit: 60000,
    creditUsed: 0,
    paymentTerms: '60',
    lastLoadDate: '2024-12-15',
    rating: 3,
  },
];

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCustomer: Customer = {
        id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
        name: customerData.name,
        contact: customerData.contact,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        status: 'Pending',
        totalLoads: 0,
        totalRevenue: 0,
        creditLimit: parseInt(customerData.creditLimit) || 50000,
        creditUsed: 0,
        paymentTerms: customerData.paymentTerms,
        lastLoadDate: '',
        rating: 0,
      };
      
      setCustomers([...customers, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCustomers(customers.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      ));
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers: fetchCustomers,
  };
};