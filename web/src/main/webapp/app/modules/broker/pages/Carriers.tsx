import React, { useState } from 'react';
import { Card, Modal } from '../../../components';
import { useCarriers } from '../hooks/useCarriers';
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

const Carriers: React.FC = () => {
  const { carriers, loading, addCarrier, updateCarrier, deleteCarrier, verifyCarrier } = useCarriers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    mc: '',
    dot: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    equipment: [] as string[],
  });

  const equipmentTypes = ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'RGN', 'Tanker', 'Box Truck'];

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carrier.mc.includes(searchTerm) ||
                         carrier.dot.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || carrier.status === statusFilter;
    const matchesEquipment = equipmentFilter === 'all' || carrier.equipment.includes(equipmentFilter);
    return matchesSearch && matchesStatus && matchesEquipment;
  });

  const handleAddCarrier = async () => {
    try {
      await addCarrier(formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        mc: '',
        dot: '',
        contact: '',
        email: '',
        phone: '',
        address: '',
        equipment: [],
      });
      toast.success('Carrier added successfully!');
    } catch (error) {
      toast.error('Failed to add carrier');
    }
  };

  const handleVerifyCarrier = async (id: string) => {
    try {
      toast.loading('Verifying carrier credentials...', { duration: 2000 });
      await verifyCarrier(id);
      setTimeout(() => {
        toast.success('Carrier verified successfully! Status updated to Active.');
      }, 2000);
    } catch (error) {
      toast.error('Failed to verify carrier');
    }
  };

  const handleViewDetails = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setShowDetailsModal(true);
  };

  const handleSendInvitation = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setInviteMessage(`Dear ${carrier.contact},\n\nWe would like to invite ${carrier.name} to join our preferred carrier network. We have loads available that match your equipment and lanes.\n\nPlease let us know if you're interested in discussing partnership opportunities.\n\nBest regards`);
    setShowInviteModal(true);
  };

  const sendInvitation = () => {
    toast.success(`Invitation sent to ${selectedCarrier?.name}!`);
    setShowInviteModal(false);
    setInviteMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Carriers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Carrier
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div>
                <input
                  type="text"
                  placeholder="Search carriers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div>
                <select
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Equipment</option>
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Carriers Display */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredCarriers.map((carrier) => (
            <Card key={carrier.id}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{carrier.name}</h3>
                        <p className="text-sm text-gray-500">MC: {carrier.mc} • DOT: {carrier.dot}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(carrier.status)}`}>
                        {carrier.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="text-sm font-medium text-gray-900">{carrier.contact}</p>
                        <p className="text-sm text-gray-600">{carrier.phone}</p>
                        <p className="text-sm text-gray-600">{carrier.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Equipment</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {carrier.equipment.map((eq) => (
                            <span key={eq} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Insurance</p>
                        <p className="text-sm text-gray-900">Liability: ${carrier.insurance.liability.toLocaleString()}</p>
                        <p className="text-sm text-gray-900">Cargo: ${carrier.insurance.cargo.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Expires: {carrier.insurance.expiresAt}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="text-center group hover:transform hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="bg-white rounded-lg shadow-sm p-3 group-hover:shadow-md">
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{carrier.totalLoads}</p>
                          <p className="text-xs text-gray-600 font-medium mt-1">Total Loads</p>
                        </div>
                      </div>
                      <div className="text-center group hover:transform hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="bg-white rounded-lg shadow-sm p-3 group-hover:shadow-md">
                          <div className="relative">
                            <p className={`text-3xl font-bold ${
                              carrier.onTimePercentage >= 95 ? 'text-green-600' : 
                              carrier.onTimePercentage >= 85 ? 'text-yellow-600' : 'text-red-600'
                            }`}>{carrier.onTimePercentage}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  carrier.onTimePercentage >= 95 ? 'bg-green-500' : 
                                  carrier.onTimePercentage >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${carrier.onTimePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 font-medium mt-1">On-Time</p>
                        </div>
                      </div>
                      <div className="text-center group hover:transform hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="bg-white rounded-lg shadow-sm p-3 group-hover:shadow-md">
                          <div className="flex items-center justify-center">
                            <p className="text-3xl font-bold text-gray-800 mr-1">{carrier.rating}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(carrier.rating) ? 'text-yellow-400' : 'text-gray-300'} transform group-hover:scale-110 transition-transform`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 font-medium mt-1">Rating</p>
                        </div>
                      </div>
                      <div className="text-center group hover:transform hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="bg-white rounded-lg shadow-sm p-3 group-hover:shadow-md">
                          <p className={`text-sm font-bold ${
                            carrier.lastLoadDate && carrier.lastLoadDate !== 'Never' ? 'text-indigo-600' : 'text-gray-400'
                          }`}>
                            {carrier.lastLoadDate || 'Never'}
                          </p>
                          <p className="text-xs text-gray-600 font-medium mt-1">Last Load</p>
                          {carrier.lastLoadDate && carrier.lastLoadDate !== 'Never' && (
                            <div className="mt-1">
                              <span className="text-xs text-green-600 font-medium">Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {carrier.lanes.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preferred Lanes</p>
                        <div className="flex flex-wrap gap-2">
                          {carrier.lanes.slice(0, 3).map((lane, index) => (
                            <span key={index} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                              {lane.origin} → {lane.destination}
                            </span>
                          ))}
                          {carrier.lanes.length > 3 && (
                            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-full">
                              +{carrier.lanes.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                      {carrier.status === 'Pending' && (
                        <button
                          onClick={() => handleVerifyCarrier(carrier.id)}
                          className="px-3 py-1 text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          Verify Carrier
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(carrier)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                      <button
                        onClick={() => handleSendInvitation(carrier)}
                        className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Invitation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    On-Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCarriers.map((carrier) => (
                  <tr key={carrier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{carrier.name}</div>
                        <div className="text-sm text-gray-500">MC: {carrier.mc} • DOT: {carrier.dot}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{carrier.contact}</div>
                        <div className="text-sm text-gray-500">{carrier.phone}</div>
                        <div className="text-sm text-gray-500">{carrier.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(carrier.status)}`}>
                        {carrier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {carrier.equipment.slice(0, 2).map((eq) => (
                          <span key={eq} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {eq}
                          </span>
                        ))}
                        {carrier.equipment.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{carrier.equipment.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {carrier.totalLoads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{carrier.onTimePercentage}%</span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{ width: `${carrier.onTimePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-1">{carrier.rating}</span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {carrier.status === 'Pending' && (
                        <button
                          onClick={() => handleVerifyCarrier(carrier.id)}
                          className="text-green-600 hover:text-green-800 font-medium mr-3"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(carrier)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleSendInvitation(carrier)}
                        className="text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Invite
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Carrier Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData({
            name: '',
            mc: '',
            dot: '',
            contact: '',
            email: '',
            phone: '',
            address: '',
            equipment: [],
          });
        }}
        title="Add New Carrier"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter carrier name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MC Number
              </label>
              <input
                type="text"
                value={formData.mc}
                onChange={(e) => setFormData({ ...formData, mc: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DOT Number
              </label>
              <input
                type="text"
                value={formData.dot}
                onChange={(e) => setFormData({ ...formData, dot: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="contact@carrier.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Types
            </label>
            <div className="space-y-2">
              {equipmentTypes.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    checked={formData.equipment.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, equipment: [...formData.equipment, type] });
                      } else {
                        setFormData({ ...formData, equipment: formData.equipment.filter(eq => eq !== type) });
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCarrier}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Carrier
            </button>
          </div>
        </div>
      </Modal>

      {/* Carrier Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCarrier(null);
        }}
        title="Carrier Details"
      >
        {selectedCarrier && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedCarrier.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">MC Number:</span>
                  <span className="ml-2 font-medium">{selectedCarrier.mc}</span>
                </div>
                <div>
                  <span className="text-gray-500">DOT Number:</span>
                  <span className="ml-2 font-medium">{selectedCarrier.dot}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCarrier.status)}`}>
                    {selectedCarrier.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Rating:</span>
                  <div className="inline-flex items-center ml-2">
                    <span className="font-medium mr-1">{selectedCarrier.rating}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Contact Person:</span> <span className="font-medium">{selectedCarrier.contact}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedCarrier.email}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedCarrier.phone}</span></div>
                <div><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedCarrier.address}</span></div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-700">{selectedCarrier.totalLoads}</p>
                  <p className="text-sm text-gray-600">Total Loads</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-700">{selectedCarrier.onTimePercentage}%</p>
                  <p className="text-sm text-gray-600">On-Time Delivery</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Insurance Information</h4>
              <div className="bg-yellow-50 rounded-lg p-3 text-sm">
                <div><span className="text-gray-600">Liability:</span> <span className="font-medium">${selectedCarrier.insurance.liability.toLocaleString()}</span></div>
                <div><span className="text-gray-600">Cargo:</span> <span className="font-medium">${selectedCarrier.insurance.cargo.toLocaleString()}</span></div>
                <div><span className="text-gray-600">Expires:</span> <span className="font-medium">{selectedCarrier.insurance.expiresAt}</span></div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Equipment Types</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCarrier.equipment.map((eq) => (
                  <span key={eq} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {selectedCarrier.lanes.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preferred Lanes</h4>
                <div className="space-y-1">
                  {selectedCarrier.lanes.map((lane, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {lane.origin} → {lane.destination}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSendInvitation(selectedCarrier);
                  setShowDetailsModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Invitation Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteMessage('');
        }}
        title="Send Carrier Invitation"
      >
        {selectedCarrier && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Sending invitation to:</p>
              <p className="font-semibold">{selectedCarrier.name}</p>
              <p className="text-sm text-gray-600">{selectedCarrier.contact} - {selectedCarrier.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation Message
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your invitation message..."
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                This invitation will be sent via email and the carrier will receive a link to join your network.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteMessage('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendInvitation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Invitation
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Carriers;