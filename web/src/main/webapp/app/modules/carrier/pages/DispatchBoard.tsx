import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal } from '../../../components';
import { mockActions, Driver } from '../../../services/mockActions';
// Define load data types for dispatch board
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
}

const DispatchBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const loadDetailsRef = useRef<HTMLDivElement>(null);

  // State for modals
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showNewLoadModal, setShowNewLoadModal] = useState(false);
  const [showEditLoadModal, setShowEditLoadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [driverAssignLoading, setDriverAssignLoading] = useState(false);

  // Mock data for the different columns
  const [bookedLoads, setBookedLoads] = useState<Load[]>([
    {
      id: 'LD1001',
      origin: 'New York, NY',
      destination: 'Chicago, IL',
      customer: 'Acme Co',
      equipment: 'Dry Van',
      date: '5/22/2025',
      price: 2850,
      status: 'Booked'
    },
    {
      id: 'LD1005',
      origin: 'Boston, MA',
      destination: 'Philadelphia, PA',
      customer: 'Reliable Transport',
      equipment: 'Reefer',
      date: '5/23/2025',
      price: 1950,
      status: 'Booked'
    }
  ]);

  const [assignedLoads, setAssignedLoads] = useState<Load[]>([
    {
      id: 'LD1002',
      origin: 'Dallas, TX',
      destination: 'Houston, TX',
      customer: 'Global Logistics',
      equipment: 'Dry Van',
      date: '5/22/2025',
      price: 950,
      driver: 'Maria Garcia',
      status: 'Assigned'
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
      status: 'Assigned'
    }
  ]);

  const [pickedUpLoads, setPickedUpLoads] = useState<Load[]>([
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
      pickupDate: '5/22/2025'
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
      pickupDate: '5/22/2025'
    }
  ]);

  const [deliveredLoads, setDeliveredLoads] = useState<Load[]>([
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
      deliveryDate: '5/22/2025'
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
      deliveryDate: '5/21/2025'
    }
  ]);

  const handleLoadClick = (load: Load) => {
    setSelectedLoad(load);
    // Scroll to load details section
    setTimeout(() => {
      if (loadDetailsRef.current) {
        loadDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked': return 'bg-gray-600 text-white';
      case 'Assigned': return 'bg-blue-600 text-white';
      case 'Picked Up': return 'bg-yellow-500 text-white';
      case 'Delivered': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Function to filter loads based on search and filter criteria
  const filterLoads = (loads: Load[]) => {
    return loads.filter(load => {
      // Search term filter (case insensitive)
      const searchLower = searchTerm.toLowerCase();
      if (searchTerm &&
          !load.id.toLowerCase().includes(searchLower) &&
          !load.origin.toLowerCase().includes(searchLower) &&
          !load.destination.toLowerCase().includes(searchLower) &&
          !load.customer.toLowerCase().includes(searchLower)) {
        return false;
      }

      // Status filter
      if (statusFilter) {
        const statusLower = statusFilter.toLowerCase();
        if (statusLower === 'booked' && load.status !== 'Booked') return false;
        if (statusLower === 'assigned' && load.status !== 'Assigned') return false;
        if (statusLower === 'picked-up' && load.status !== 'Picked Up') return false;
        if (statusLower === 'delivered' && load.status !== 'Delivered') return false;
      }

      // Customer filter
      if (customerFilter && load.customer !== customerFilter) {
        return false;
      }

      // Equipment filter
      if (equipmentFilter && load.equipment !== equipmentFilter) {
        return false;
      }

      return true;
    });
  };

  // Function to fetch available drivers
  const fetchAvailableDrivers = async () => {
    try {
      const drivers = await mockActions.getAvailableDrivers();
      setAvailableDrivers(drivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  // Function to open driver assignment modal
  const openDriverModal = async (load: Load) => {
    setSelectedLoad(load);
    setLoading(true);
    // Reset driver assignment state
    setSelectedDriver('');
    setDriverAssignLoading(false);
    await fetchAvailableDrivers();
    setLoading(false);
    setShowDriverModal(true);
  };

  // Function to assign driver
  const assignDriver = async () => {
    if (!selectedLoad || !selectedDriver) return;

    setDriverAssignLoading(true);
    try {
      const updatedLoad = await mockActions.assignDriver(selectedLoad.id, selectedDriver);

      // Update the local state to reflect the change
      const updatedBookedLoads = bookedLoads.filter(load => load.id !== selectedLoad.id);
      setBookedLoads(updatedBookedLoads);

      const newAssignedLoad = {
        ...selectedLoad,
        status: updatedLoad.status,
        driver: updatedLoad.driver
      };

      setAssignedLoads([...assignedLoads, newAssignedLoad]);
      setSelectedLoad(newAssignedLoad);
      setShowDriverModal(false);
    } catch (error) {
      console.error('Error assigning driver:', error);
    } finally {
      setDriverAssignLoading(false);
    }
  };

  // Function to mark as picked up
  const markAsPickedUp = async (load: Load) => {
    setLoading(true);
    try {
      const updatedLoad = await mockActions.markAsPickedUp(load.id);

      // Update the local state to reflect the change
      const updatedAssignedLoads = assignedLoads.filter(l => l.id !== load.id);
      setAssignedLoads(updatedAssignedLoads);

      const newPickedUpLoad = {
        ...load,
        status: updatedLoad.status,
        pickupDate: updatedLoad.pickupDate,
        eta: updatedLoad.eta
      };

      setPickedUpLoads([...pickedUpLoads, newPickedUpLoad]);
      setSelectedLoad(newPickedUpLoad);
    } catch (error) {
      console.error('Error marking as picked up:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to mark as delivered
  const markAsDelivered = async (load: Load) => {
    setLoading(true);
    try {
      const updatedLoad = await mockActions.markAsDelivered(load.id);

      // Update the local state to reflect the change
      const updatedPickedUpLoads = pickedUpLoads.filter(l => l.id !== load.id);
      setPickedUpLoads(updatedPickedUpLoads);

      const newDeliveredLoad = {
        ...load,
        status: updatedLoad.status,
        deliveryDate: updatedLoad.deliveryDate
      };

      setDeliveredLoads([...deliveredLoads, newDeliveredLoad]);
      setSelectedLoad(newDeliveredLoad);
    } catch (error) {
      console.error('Error marking as delivered:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to create invoice
  const createInvoice = async (load: Load) => {
    setLoading(true);
    try {
      await mockActions.createInvoice(load.id);
      // No state update needed for this action
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new load
  const createNewLoad = async () => {
    // This would typically collect form data, but for demo we'll create a load with default values
    setLoading(true);
    try {
      const newLoadData = {
        pickupLocation: 'New Origin, NY',
        deliveryLocation: 'New Destination, CA',
        customerId: 'New Customer',
        equipmentType: 'Dry Van',
        pickupDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date().toISOString().split('T')[0],
        rate: 1500
      };

      const result = await mockActions.createLoad(newLoadData);

      const newLoad: Load = {
        id: result.id,
        origin: newLoadData.pickupLocation,
        destination: newLoadData.deliveryLocation,
        customer: newLoadData.customerId || 'New Customer',
        equipment: newLoadData.equipmentType,
        date: newLoadData.pickupDate,
        price: newLoadData.rate,
        status: 'Booked',
        pickupDate: newLoadData.pickupDate,
        deliveryDate: newLoadData.deliveryDate,
        driver: 'Unassigned'
      };

      setBookedLoads([...bookedLoads, newLoad]);
      setShowNewLoadModal(false);
    } catch (error) {
      console.error('Error creating new load:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to duplicate a load
  const duplicateLoad = async (load: Load) => {
    setLoading(true);
    try {
      const result = await mockActions.duplicateLoad(load.id);

      const newLoad: Load = {
        ...load,
        id: result.id,
        status: 'Booked',
        driver: undefined,
        pickupDate: undefined,
        deliveryDate: undefined,
        eta: undefined
      };

      setBookedLoads([...bookedLoads, newLoad]);
    } catch (error) {
      console.error('Error duplicating load:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLoadCard = (load: Load) => {
    return (
      <div
        key={load.id}
        className="load-card bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
        onClick={() => handleLoadClick(load)}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-blue-600">{load.id}</span>
          <span className={`status-badge px-2 py-1 rounded-full text-xs ${getStatusColor(load.status)}`}>
            {load.status}
          </span>
        </div>
        <div className="mb-2">
          <div className="font-medium">{load.origin} → {load.destination}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <span>{load.customer}</span>
            <span className="mx-1.5">•</span>
            <span>{load.equipment}</span>
          </div>
        </div>
        {load.driver && (
          <div className="text-sm mb-1 flex items-center text-gray-600">
            <i className="fas fa-user mr-1.5 text-blue-500"></i>
            <span>{load.driver}</span>
          </div>
        )}
        {load.eta && (
          <div className="text-sm mb-1 flex items-center text-gray-600">
            <i className="fas fa-clock mr-1.5 text-blue-500"></i>
            <span>ETA: {load.eta}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-600">{load.date}</div>
          <div className="text-sm font-semibold">${load.price.toLocaleString()}</div>
        </div>
        <div className="mt-3">
          {load.status === 'Booked' && (
            <button
              className="btn btn-sm btn-outline-primary w-full px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openDriverModal(load);
              }}
            >
              <i className="fas fa-user-plus mr-1.5"></i>
              Assign Driver
            </button>
          )}
          {load.status === 'Assigned' && (
            <button
              className="btn btn-sm btn-outline-success w-full px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                markAsPickedUp(load);
              }}
            >
              <i className="fas fa-truck mr-1.5"></i>
              Mark as Picked Up
            </button>
          )}
          {load.status === 'Picked Up' && (
            <button
              className="btn btn-sm btn-outline-success w-full px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                markAsDelivered(load);
              }}
            >
              <i className="fas fa-check-circle mr-1.5"></i>
              Mark as Delivered
            </button>
          )}
          {load.status === 'Delivered' && (
            <button
              className="btn btn-sm btn-outline-primary w-full px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                createInvoice(load);
              }}
            >
              <i className="fas fa-file-invoice-dollar mr-1.5"></i>
              Create Invoice
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dispatch Board</h1>
        <p className="text-gray-600">Manage and track all your shipments</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex space-x-3">
          <button
            className="btn btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setShowNewLoadModal(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Load
          </button>
          <Link
            to="/all-loads"
            className="btn btn-outline-primary flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
          >
            <i className="fas fa-table mr-2"></i>
            View All Loads
          </Link>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative w-full md:w-64">
            <label htmlFor="search-loads" className="sr-only">Search loads</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              id="search-loads"
              type="text"
              className="form-control pl-10 border border-gray-300 rounded-md py-2 px-4 w-full"
              placeholder="Search loads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
            <select
              id="status-filter"
              className="form-select border border-gray-300 rounded-md py-2 px-4 w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="booked">Booked</option>
              <option value="assigned">Assigned</option>
              <option value="picked-up">Picked Up</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Customer filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="customer-filter" className="sr-only">Filter by Customer</label>
            <select
              id="customer-filter"
              className="form-select border border-gray-300 rounded-md py-2 px-4 w-full"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            >
              <option value="">All Customers</option>
              <option value="Acme Co">Acme Co</option>
              <option value="Global Logistics">Global Logistics</option>
              <option value="Fast Freight">Fast Freight</option>
              <option value="Speedy Shipping">Speedy Shipping</option>
              <option value="Reliable Transport">Reliable Transport</option>
              <option value="Prime Delivery">Prime Delivery</option>
            </select>
          </div>

          {/* Equipment filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="equipment-filter" className="sr-only">Filter by Equipment</label>
            <select
              id="equipment-filter"
              className="form-select border border-gray-300 rounded-md py-2 px-4 w-full"
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
            >
              <option value="">All Equipment</option>
              <option value="Dry Van">Dry Van</option>
              <option value="Reefer">Reefer</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Tanker">Tanker</option>
            </select>
          </div>

          {/* Clear filters button */}
          {(searchTerm || statusFilter || customerFilter || equipmentFilter) && (
            <button
              className="btn btn-outline-danger flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCustomerFilter('');
                setEquipmentFilter('');
              }}
            >
              <i className="fas fa-times mr-2"></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Booked Column */}
        <div className="h-full">
          <div className={`py-2 px-4 rounded-t-lg font-semibold text-white flex items-center justify-between ${getStatusColor('Booked')}`}>
            <div className="flex items-center">
              <i className="fas fa-bookmark mr-2"></i>
              <span>Booked</span>
            </div>
            <div className="bg-white text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
              {bookedLoads.length}
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-lg p-3 h-[calc(100vh-240px)] overflow-y-auto scrollbar-thin">
            {bookedLoads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-3xl mb-2"></i>
                <p>No booked loads</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterLoads(bookedLoads).map(load => renderLoadCard(load))}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Column */}
        <div className="h-full">
          <div className={`py-2 px-4 rounded-t-lg font-semibold text-white flex items-center justify-between ${getStatusColor('Assigned')}`}>
            <div className="flex items-center">
              <i className="fas fa-user-check mr-2"></i>
              <span>Assigned</span>
            </div>
            <div className="bg-white text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
              {assignedLoads.length}
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-lg p-3 h-[calc(100vh-240px)] overflow-y-auto scrollbar-thin">
            {assignedLoads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-3xl mb-2"></i>
                <p>No assigned loads</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterLoads(assignedLoads).map(load => renderLoadCard(load))}
              </div>
            )}
          </div>
        </div>

        {/* Picked Up Column */}
        <div className="h-full">
          <div className={`py-2 px-4 rounded-t-lg font-semibold text-white flex items-center justify-between ${getStatusColor('Picked Up')}`}>
            <div className="flex items-center">
              <i className="fas fa-truck mr-2"></i>
              <span>Picked Up</span>
            </div>
            <div className="bg-white text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
              {pickedUpLoads.length}
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-lg p-3 h-[calc(100vh-240px)] overflow-y-auto scrollbar-thin">
            {pickedUpLoads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-3xl mb-2"></i>
                <p>No loads in transit</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterLoads(pickedUpLoads).map(load => renderLoadCard(load))}
              </div>
            )}
          </div>
        </div>

        {/* Delivered Column */}
        <div className="h-full">
          <div className={`py-2 px-4 rounded-t-lg font-semibold text-white flex items-center justify-between ${getStatusColor('Delivered')}`}>
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>Delivered</span>
            </div>
            <div className="bg-white text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
              {deliveredLoads.length}
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-lg p-3 h-[calc(100vh-240px)] overflow-y-auto scrollbar-thin">
            {deliveredLoads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-3xl mb-2"></i>
                <p>No delivered loads</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterLoads(deliveredLoads).map(load => renderLoadCard(load))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6" ref={loadDetailsRef}>
        <h2 className="flex items-center text-xl font-semibold mb-4">
          <i className="fas fa-info-circle mr-2 text-blue-600"></i>
          Load Details
        </h2>
        <Card>
          {selectedLoad ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">{selectedLoad.id}</span>
                    <span className={`status-badge px-2 py-1 rounded-full text-xs ${getStatusColor(selectedLoad.status)}`}>
                      {selectedLoad.status}
                    </span>
                  </h3>
                  <p className="text-gray-600">{selectedLoad.origin} → {selectedLoad.destination}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-gray-700">
                    <span className="font-semibold">Price:</span> ${selectedLoad.price.toLocaleString()}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">Date:</span> {selectedLoad.date}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Shipment Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Customer</span>
                      <div className="font-medium">{selectedLoad.customer}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Equipment</span>
                      <div className="font-medium">{selectedLoad.equipment}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Origin</span>
                      <div className="font-medium">{selectedLoad.origin}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Destination</span>
                      <div className="font-medium">{selectedLoad.destination}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Status Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Current Status</span>
                      <div className="font-medium">{selectedLoad.status}</div>
                    </div>
                    {selectedLoad.driver && (
                      <div>
                        <span className="text-sm text-gray-500">Driver</span>
                        <div className="font-medium">{selectedLoad.driver}</div>
                      </div>
                    )}
                    {selectedLoad.pickupDate && (
                      <div>
                        <span className="text-sm text-gray-500">Pickup Date</span>
                        <div className="font-medium">{selectedLoad.pickupDate}</div>
                      </div>
                    )}
                    {selectedLoad.deliveryDate && (
                      <div>
                        <span className="text-sm text-gray-500">Delivery Date</span>
                        <div className="font-medium">{selectedLoad.deliveryDate}</div>
                      </div>
                    )}
                    {selectedLoad.eta && (
                      <div>
                        <span className="text-sm text-gray-500">ETA</span>
                        <div className="font-medium">{selectedLoad.eta}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                {selectedLoad.status === 'Booked' && (
                  <button
                    className="btn btn-primary flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => openDriverModal(selectedLoad)}
                    disabled={loading}
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Assign Driver
                  </button>
                )}
                {selectedLoad.status === 'Assigned' && (
                  <button
                    className="btn btn-success flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    onClick={() => markAsPickedUp(selectedLoad)}
                    disabled={loading}
                  >
                    <i className="fas fa-truck mr-2"></i>
                    Mark as Picked Up
                  </button>
                )}
                {selectedLoad.status === 'Picked Up' && (
                  <button
                    className="btn btn-success flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    onClick={() => markAsDelivered(selectedLoad)}
                    disabled={loading}
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    Mark as Delivered
                  </button>
                )}
                {selectedLoad.status === 'Delivered' && (
                  <button
                    className="btn btn-primary flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => createInvoice(selectedLoad)}
                    disabled={loading}
                  >
                    <i className="fas fa-file-invoice-dollar mr-2"></i>
                    Create Invoice
                  </button>
                )}
                <button
                  className="btn btn-outline-secondary flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setShowEditLoadModal(true)}
                  disabled={loading}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Load
                </button>
                <button
                  className="btn btn-outline-secondary flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => duplicateLoad(selectedLoad)}
                  disabled={loading}
                >
                  <i className="fas fa-copy mr-2"></i>
                  Duplicate
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <i className="fas fa-truck-loading text-5xl mb-3"></i>
              <p className="text-lg">No load selected</p>
              <p className="text-sm">Click on a load to view its details</p>
            </div>
          )}
        </Card>
      </div>

      {/* Driver Assignment Modal */}
      <Modal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        title="Select a driver to assign to load"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowDriverModal(false)}
              disabled={driverAssignLoading}
            >
              Cancel
            </button>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={assignDriver}
              disabled={driverAssignLoading || !selectedDriver}
            >
              {driverAssignLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Assigning...
                </span>
              ) : 'Assign Driver'}
            </button>
          </div>
        }
      >
        <div className="mb-4">
          <p className="mb-2 font-medium">Load: {selectedLoad?.id}</p>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : availableDrivers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-user-slash text-3xl mb-2"></i>
              <p>No available drivers found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {availableDrivers.map(driver => (
                <div
                  key={driver.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedDriver === driver.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setSelectedDriver(driver.id)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-gray-600">{driver.phone}</div>
                    </div>
                    {selectedDriver === driver.id && (
                      <div className="ml-auto text-blue-600">
                        <i className="fas fa-check-circle"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* New Load Modal */}
      <Modal
        isOpen={showNewLoadModal}
        onClose={() => setShowNewLoadModal(false)}
        title="Create New Load"
        size="lg"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowNewLoadModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={createNewLoad}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Load'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* For demo purposes, we'll just show form fields without actually collecting the data */}
          <div>
            <label htmlFor="new-origin" className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <input
              id="new-origin"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="New York, NY"
            />
          </div>
          <div>
            <label htmlFor="new-destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              id="new-destination"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="Chicago, IL"
            />
          </div>
          <div>
            <label htmlFor="new-customer" className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              id="new-customer"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option>Acme Co</option>
              <option>Global Logistics</option>
              <option>Fast Freight</option>
              <option>Speedy Shipping</option>
            </select>
          </div>
          <div>
            <label htmlFor="new-equipment" className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
            <select
              id="new-equipment"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option>Dry Van</option>
              <option>Reefer</option>
              <option>Flatbed</option>
              <option>Tanker</option>
            </select>
          </div>
          <div>
            <label htmlFor="new-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              id="new-date"
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div>
            <label htmlFor="new-price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              id="new-price"
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="1500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="new-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="new-notes"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              rows={3}
              placeholder="Enter any additional information about this load"
            ></textarea>
          </div>
        </div>
      </Modal>

      {/* Edit Load Modal */}
      <Modal
        isOpen={showEditLoadModal}
        onClose={() => setShowEditLoadModal(false)}
        title={`Edit Load ${selectedLoad?.id}`}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowEditLoadModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {
                // In a real app, we would update the load
                setShowEditLoadModal(false);
                mockActions.editLoad(selectedLoad?.id || '', {});
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        {selectedLoad && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-origin" className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input
                id="edit-origin"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                defaultValue={selectedLoad.origin}
              />
            </div>
            <div>
              <label htmlFor="edit-destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                id="edit-destination"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                defaultValue={selectedLoad.destination}
              />
            </div>
            <div>
              <label htmlFor="edit-customer" className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                id="edit-customer"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                defaultValue={selectedLoad.customer}
              >
                <option>Acme Co</option>
                <option>Global Logistics</option>
                <option>Fast Freight</option>
                <option>Speedy Shipping</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-equipment" className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
              <select
                id="edit-equipment"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                defaultValue={selectedLoad.equipment}
              >
                <option>Dry Van</option>
                <option>Reefer</option>
                <option>Flatbed</option>
                <option>Tanker</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                id="edit-date"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                defaultValue={selectedLoad.date}
              />
            </div>
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                id="edit-price"
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                defaultValue={selectedLoad.price}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DispatchBoard;
