import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { mockActions, notify } from '../../../services';

// Define load data types
interface Load {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  equipment: string;
  date: string;
  price: number;
  driver?: string;
  status: 'Booked' | 'Assigned' | 'Picked Up' | 'Delivered';
  eta?: string;
  pickupDate?: string;
  deliveryDate?: string;
  miles?: number;
  weight?: string;
  broker?: string;
}

interface SortConfig {
  key: keyof Load;
  direction: 'asc' | 'desc';
}

const AllLoads: React.FC = () => {
  const navigate = useNavigate();
  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Fetch all loads
  useEffect(() => {
    const fetchLoads = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 800));

        // Combine loads from different statuses in DispatchBoard
        const allLoads = [
          // Booked loads
          {
            id: 'LD1001',
            origin: 'New York, NY',
            destination: 'Chicago, IL',
            customer: 'Acme Co',
            equipment: 'Dry Van',
            date: '5/22/2025',
            price: 2850,
            status: 'Booked',
            miles: 750,
            weight: '42,000 lbs',
            broker: 'ABC Logistics'
          },
          {
            id: 'LD1005',
            origin: 'Boston, MA',
            destination: 'Philadelphia, PA',
            customer: 'Reliable Transport',
            equipment: 'Reefer',
            date: '5/23/2025',
            price: 1950,
            status: 'Booked',
            miles: 320,
            weight: '38,000 lbs',
            broker: 'East Coast Shipping'
          },
          // Assigned loads
          {
            id: 'LD1002',
            origin: 'Dallas, TX',
            destination: 'Houston, TX',
            customer: 'Global Logistics',
            equipment: 'Dry Van',
            date: '5/22/2025',
            price: 950,
            driver: 'Maria Garcia',
            status: 'Assigned',
            miles: 240,
            weight: '36,000 lbs',
            broker: 'Texas Freight'
          },
          {
            id: 'LD1006',
            origin: 'San Francisco, CA',
            destination: 'Los Angeles, CA',
            customer: 'Prime Delivery',
            equipment: 'Flatbed',
            date: '5/23/2025',
            price: 1250,
            driver: 'David Brown',
            status: 'Assigned',
            miles: 380,
            weight: '40,000 lbs',
            broker: 'West Coast Logistics'
          },
          // Picked Up loads
          {
            id: 'LD1003',
            origin: 'Miami, FL',
            destination: 'Atlanta, GA',
            customer: 'Fast Freight',
            equipment: 'Reefer',
            date: '5/22/2025',
            price: 1750,
            driver: 'Robert Johnson',
            status: 'Picked Up',
            eta: '5/24/2025 14:30',
            pickupDate: '5/22/2025',
            miles: 660,
            weight: '39,000 lbs',
            broker: 'Southern Transport'
          },
          {
            id: 'LD1007',
            origin: 'Denver, CO',
            destination: 'Phoenix, AZ',
            customer: 'Acme Co',
            equipment: 'Dry Van',
            date: '5/22/2025',
            price: 2100,
            driver: 'John Smith',
            status: 'Picked Up',
            eta: '5/24/2025 18:45',
            pickupDate: '5/22/2025',
            miles: 580,
            weight: '41,000 lbs',
            broker: 'Mountain Freight'
          },
          // Delivered loads
          {
            id: 'LD1004',
            origin: 'Seattle, WA',
            destination: 'Portland, OR',
            customer: 'Speedy Shipping',
            equipment: 'Dry Van',
            date: '5/22/2025',
            price: 795,
            driver: 'Sarah Williams',
            status: 'Delivered',
            deliveryDate: '5/22/2025',
            miles: 175,
            weight: '35,000 lbs',
            broker: 'Northwest Logistics'
          },
          {
            id: 'LD1008',
            origin: 'Minneapolis, MN',
            destination: 'Milwaukee, WI',
            customer: 'Global Logistics',
            equipment: 'Flatbed',
            date: '5/21/2025',
            price: 850,
            driver: 'Maria Garcia',
            status: 'Delivered',
            deliveryDate: '5/21/2025',
            miles: 340,
            weight: '37,000 lbs',
            broker: 'Midwest Transport'
          }
        ];

        // @ts-ignore
        setLoads(allLoads);
        // @ts-ignore
        setFilteredLoads(allLoads);
      } catch (error) {
        notify('Error fetching loads. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, []);

  // Filter loads based on search term and status filter
  useEffect(() => {
    const filtered = loads.filter(load => {
      const matchesSearch = 
        load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (load.driver && load.driver.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter ? load.status.toLowerCase() === statusFilter.toLowerCase() : true;

      return matchesSearch && matchesStatus;
    });

    // Sort the filtered loads
    const sortedLoads = [...filtered].sort((a, b) => {
      // @ts-ignore
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      // @ts-ignore
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredLoads(sortedLoads);
  }, [loads, searchTerm, statusFilter, sortConfig]);

  // Handle sort
  const handleSort = (key: keyof Load) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort indicator
  const getSortIndicator = (key: keyof Load) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Handle view load details
  const handleViewLoadDetails = (loadId: string) => {
    navigate(`/load-details/${loadId}`);
  };

  // Export to CSV
  const exportToCSV = async () => {
    setExportLoading(true);
    try {
      // In a real app, this might be handled differently
      // For now, we'll create a CSV string and download it
      const headers = ['ID', 'Origin', 'Destination', 'Customer', 'Equipment', 'Date', 'Price', 'Driver', 'Status'];
      const csvContent = [
        headers.join(','),
        ...filteredLoads.map(load => [
          load.id,
          `"${load.origin}"`,
          `"${load.destination}"`,
          `"${load.customer}"`,
          load.equipment,
          load.date,
          load.price,
          load.driver ? `"${load.driver}"` : '',
          load.status
        ].join(','))
      ].join('\n');

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'all_loads.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notify('Loads exported to CSV successfully');
    } catch (error) {
      notify('Error exporting to CSV. Please try again.', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Export to Excel
  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      // In a real app, this would use a library like xlsx
      // For now, we'll just simulate a delay and notify the user
      await new Promise(resolve => setTimeout(resolve, 800));
      notify('Loads exported to Excel successfully');
    } catch (error) {
      notify('Error exporting to Excel. Please try again.', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked': return 'bg-gray-600 text-white';
      case 'Assigned': return 'bg-blue-600 text-white';
      case 'Picked Up': return 'bg-yellow-500 text-white';
      case 'Delivered': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Loads</h1>
          <p className="text-gray-600">View and manage all loads in the system</p>
        </div>
        <div className="flex space-x-3">
          <button 
            className="btn btn-outline-secondary flex items-center"
            onClick={exportToCSV}
            disabled={exportLoading || filteredLoads.length === 0}
          >
            <i className="fas fa-file-csv mr-2"></i>Export CSV
          </button>
          <button 
            className="btn btn-outline-secondary flex items-center"
            onClick={exportToExcel}
            disabled={exportLoading || filteredLoads.length === 0}
          >
            <i className="fas fa-file-excel mr-2"></i>Export Excel
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-grow md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input 
            type="text" 
            className="form-control pl-10 border border-gray-300 rounded-md py-2 px-4 w-full" 
            placeholder="Search loads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3 w-full md:w-auto">
          <select 
            className="form-select border border-gray-300 rounded-md py-2 px-4 flex-grow md:flex-grow-0 md:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="assigned">Assigned</option>
            <option value="picked up">Picked Up</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLoads.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <i className="fas fa-search text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No loads found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Try adjusting your search criteria to find loads.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    ID {getSortIndicator('id')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('origin')}
                  >
                    Origin {getSortIndicator('origin')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('destination')}
                  >
                    Destination {getSortIndicator('destination')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customer')}
                  >
                    Customer {getSortIndicator('customer')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('equipment')}
                  >
                    Equipment {getSortIndicator('equipment')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date {getSortIndicator('date')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    Price {getSortIndicator('price')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('driver')}
                  >
                    Driver {getSortIndicator('driver')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIndicator('status')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoads.map((load) => (
                  <tr 
                    key={load.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewLoadDetails(load.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {load.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {load.origin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {load.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {load.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {load.equipment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {load.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${load.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {load.driver || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(load.status)}`}>
                        {load.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AllLoads;
