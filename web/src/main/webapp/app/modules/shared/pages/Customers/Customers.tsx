import React, { useState } from 'react';
import { Card, Modal } from '../../../../components';
import { useRoleConfig } from '../../hooks/useRoleConfig';
import { useAuth } from '../../../../context/AuthContext';
import { UserRole } from '../../../../types/core/user.types';
import toast from 'react-hot-toast';
import * as formatters from '../../utils/formatters';

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
  // Role-specific fields
  contractedCarriers?: number;  // For broker
  preferredLanes?: string[];     // For shipper
  equipmentTypes?: string[];     // For carrier
}

const Customers: React.FC = () => {
  const { user } = useAuth();
  const config = useRoleConfig('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Role-based mock data
  const getRoleBasedCustomers = (): Customer[] => {
    const baseCustomers: Customer[] = [
      {
        id: '1',
        name: 'Acme Corporation',
        contact: 'John Smith',
        email: 'john@acme.com',
        phone: '(555) 123-4567',
        address: '123 Business Blvd, Chicago, IL 60601',
        status: 'Active',
        totalLoads: 145,
        totalRevenue: 325000,
        creditLimit: 50000,
        creditUsed: 15000,
        paymentTerms: 'Net 30',
        lastLoadDate: '2024-03-15',
        rating: 4.8,
      },
      {
        id: '2',
        name: 'Global Logistics Inc',
        contact: 'Sarah Johnson',
        email: 'sarah@globallogistics.com',
        phone: '(555) 234-5678',
        address: '456 Commerce St, Dallas, TX 75201',
        status: 'Active',
        totalLoads: 89,
        totalRevenue: 198000,
        creditLimit: 75000,
        creditUsed: 22000,
        paymentTerms: 'Net 45',
        lastLoadDate: '2024-03-18',
        rating: 4.5,
      }
    ];

    // Add role-specific fields
    if (user?.role === UserRole.BROKER) {
      return baseCustomers.map(c => ({
        ...c,
        contractedCarriers: Math.floor(Math.random() * 20) + 5,
      }));
    } else if (user?.role === UserRole.SHIPPER) {
      return baseCustomers.map(c => ({
        ...c,
        preferredLanes: ['Chicago-Dallas', 'Dallas-Phoenix', 'Phoenix-LA'],
      }));
    } else if (user?.role === UserRole.CARRIER) {
      return baseCustomers.map(c => ({
        ...c,
        equipmentTypes: ['Dry Van', 'Reefer', 'Flatbed'],
      }));
    }
    
    return baseCustomers;
  };

  const [customers] = useState<Customer[]>(getRoleBasedCustomers());
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    creditLimit: '',
    paymentTerms: '30',
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = async () => {
    try {
      // In real app, would call API
      toast.success('Customer added successfully');
      setShowAddModal(false);
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        creditLimit: '',
        paymentTerms: '30',
      });
    } catch (error) {
      toast.error('Failed to add customer');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRoleSpecificInfo = (customer: Customer) => {
    if (user?.role === UserRole.BROKER) {
      return (
        <div className="text-sm text-gray-600">
          <p>Contracted Carriers: {customer.contractedCarriers}</p>
        </div>
      );
    } else if (user?.role === UserRole.SHIPPER) {
      return (
        <div className="text-sm text-gray-600">
          <p>Preferred Lanes: {customer.preferredLanes?.join(', ')}</p>
        </div>
      );
    } else if (user?.role === UserRole.CARRIER) {
      return (
        <div className="text-sm text-gray-600">
          <p>Equipment: {customer.equipmentTypes?.join(', ')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{config.title || 'Customers'}</h1>
        <p className="text-gray-600">Manage your customer relationships</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Customer
        </button>
      </div>

      {/* Customer List/Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} onClick={() => setSelectedCustomer(customer)}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-600">{customer.contact}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Loads:</span>
                  <span className="font-medium">{customer.totalLoads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">{formatters.formatCurrency(customer.totalRevenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credit Available:</span>
                  <span className="font-medium text-green-600">
                    {formatters.formatCurrency(customer.creditLimit - customer.creditUsed)}
                  </span>
                </div>
              </div>

              {renderRoleSpecificInfo(customer)}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(customer.rating) ? '' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{customer.rating}</span>
                </div>
                <span className="text-xs text-gray-500">
                  Last Load: {new Date(customer.lastLoadDate).toLocaleDateString()}
                </span>
              </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Loads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.contact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalLoads}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatters.formatCurrency(customer.totalRevenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatters.formatCurrency(customer.creditLimit - customer.creditUsed)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{customer.rating}</span>
                      <i className="fas fa-star text-yellow-400 ml-1"></i>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Customer"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Due on Receipt</option>
                  <option value="15">Net 15</option>
                  <option value="30">Net 30</option>
                  <option value="45">Net 45</option>
                  <option value="60">Net 60</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Customer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title="Customer Details"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-gray-600">{selectedCustomer.contact}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                {selectedCustomer.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{selectedCustomer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{selectedCustomer.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Terms</p>
                <p className="font-medium">{selectedCustomer.paymentTerms}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalLoads}</p>
                <p className="text-sm text-gray-600">Total Loads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatters.formatCurrency(selectedCustomer.totalRevenue)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{formatters.formatCurrency(selectedCustomer.creditLimit - selectedCustomer.creditUsed)}</p>
                <p className="text-sm text-gray-600">Available Credit</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Customer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Customers;