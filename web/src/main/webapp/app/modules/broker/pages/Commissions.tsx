import React, { useState } from 'react';
import { Card, Modal } from '../../../components';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'inactive';
  commissionRate: number;
  totalLoads: number;
  totalRevenue: number;
  totalCommission: number;
  avatar?: string;
}

interface Load {
  id: string;
  loadNumber: string;
  customer: string;
  origin: string;
  destination: string;
  revenue: number;
  margin: number;
  status: 'delivered' | 'in-transit' | 'pending';
  deliveryDate: string;
  salesRep: string;
  salesRepId: string;
  commissionRate: number;
  commissionAmount: number;
}

interface CommissionPeriod {
  period: string;
  totalRevenue: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  loadCount: number;
}

const Commissions: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null);
  const [showRepModal, setShowRepModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddRepModal, setShowAddRepModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedReps, setSelectedReps] = useState<string[]>([]);

  // Mock sales reps data
  const salesReps: SalesRep[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '(555) 123-4567',
      hireDate: '2023-01-15',
      status: 'active',
      commissionRate: 8,
      totalLoads: 145,
      totalRevenue: 485000,
      totalCommission: 38800
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '(555) 234-5678',
      hireDate: '2022-06-20',
      status: 'active',
      commissionRate: 10,
      totalLoads: 238,
      totalRevenue: 752000,
      totalCommission: 75200
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      phone: '(555) 345-6789',
      hireDate: '2023-03-10',
      status: 'active',
      commissionRate: 6,
      totalLoads: 98,
      totalRevenue: 295000,
      totalCommission: 17700
    },
    {
      id: '4',
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      phone: '(555) 456-7890',
      hireDate: '2021-11-05',
      status: 'active',
      commissionRate: 12,
      totalLoads: 312,
      totalRevenue: 1025000,
      totalCommission: 123000
    }
  ];

  // Add function to toggle rep selection
  const toggleRepSelection = (repId: string) => {
    setSelectedReps(prev => 
      prev.includes(repId) 
        ? prev.filter(id => id !== repId)
        : [...prev, repId]
    );
  };

  // Add function to handle save commission rate
  const handleSaveCommissionRate = async (rep: SalesRep, newRate: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Commission rate updated to ${newRate}% for ${rep.name}`);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating commission rate:', error);
      toast.error('Failed to update commission rate');
    } finally {
      setLoading(false);
    }
  };

  // Add function to handle add new sales rep
  const handleAddSalesRep = async (repData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('New sales rep added successfully');
      setShowAddRepModal(false);
    } catch (error) {
      console.error('Error adding sales rep:', error);
      toast.error('Failed to add sales rep');
    } finally {
      setLoading(false);
    }
  };

  // Mock loads data
  const recentLoads: Load[] = [
    {
      id: '1',
      loadNumber: 'LD-2024-001',
      customer: 'ABC Manufacturing',
      origin: 'Chicago, IL',
      destination: 'Dallas, TX',
      revenue: 3500,
      margin: 700,
      status: 'delivered',
      deliveryDate: '2025-05-25',
      salesRep: 'John Smith',
      salesRepId: '1',
      commissionRate: 8,
      commissionAmount: 280
    },
    {
      id: '2',
      loadNumber: 'LD-2024-002',
      customer: 'XYZ Logistics',
      origin: 'New York, NY',
      destination: 'Miami, FL',
      revenue: 4200,
      margin: 840,
      status: 'delivered',
      deliveryDate: '2025-05-24',
      salesRep: 'Sarah Johnson',
      salesRepId: '2',
      commissionRate: 10,
      commissionAmount: 420
    },
    {
      id: '3',
      loadNumber: 'LD-2024-003',
      customer: 'Global Transport',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      revenue: 2800,
      margin: 560,
      status: 'in-transit',
      deliveryDate: '2025-05-26',
      salesRep: 'Mike Davis',
      salesRepId: '3',
      commissionRate: 6,
      commissionAmount: 168
    },
    {
      id: '4',
      loadNumber: 'LD-2024-004',
      customer: 'Fast Freight Inc',
      origin: 'Houston, TX',
      destination: 'Phoenix, AZ',
      revenue: 3100,
      margin: 620,
      status: 'delivered',
      deliveryDate: '2025-05-23',
      salesRep: 'Emily Chen',
      salesRepId: '4',
      commissionRate: 12,
      commissionAmount: 372
    }
  ];

  // Commission periods data
  const commissionPeriods: CommissionPeriod[] = [
    {
      period: 'May 2025',
      totalRevenue: 245000,
      totalCommission: 22050,
      paidCommission: 0,
      pendingCommission: 22050,
      loadCount: 78
    },
    {
      period: 'April 2025',
      totalRevenue: 312000,
      totalCommission: 28080,
      paidCommission: 28080,
      pendingCommission: 0,
      loadCount: 92
    },
    {
      period: 'March 2025',
      totalRevenue: 298000,
      totalCommission: 26820,
      paidCommission: 26820,
      pendingCommission: 0,
      loadCount: 87
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'in-transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals
  const currentPeriod = commissionPeriods[0];
  const totalActiveReps = salesReps.filter(rep => rep.status === 'active').length;
  const averageCommissionRate = salesReps.reduce((sum, rep) => sum + rep.commissionRate, 0) / salesReps.length;

  // Handle view rep details
  const handleViewRepDetails = (rep: SalesRep) => {
    setSelectedRep(rep);
    setShowRepModal(true);
  };

  // Handle process payment
  const handleProcessPayment = async (rep: SalesRep) => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Payment of ${formatCurrency(6280)} processed for ${rep.name}`);
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit commission rate
  const handleEditCommissionRate = (rep: SalesRep) => {
    setSelectedRep(rep);
    setShowEditModal(true);
  };

  // Handle generate report
  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Commission report generated successfully');
      setShowExportModal(true);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk payment
  const handleBulkPayment = async () => {
    if (selectedReps.length === 0) {
      toast.error('Please select at least one sales rep for bulk payment');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate bulk payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Bulk payment processed for ${selectedReps.length} sales reps`);
      setSelectedReps([]);
    } catch (error) {
      console.error('Error processing bulk payment:', error);
      toast.error('Failed to process bulk payments');
    } finally {
      setLoading(false);
    }
  };

  // Filter reps
  const filteredReps = salesReps.filter(rep => {
    const matchesSearch = searchQuery === '' || 
      rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Commissions</h1>
          <p className="text-gray-600">Track and manage sales representative commissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            className="btn btn-secondary flex items-center"
            onClick={() => navigate('/settings')}
          >
            <i className="fas fa-cog mr-2"></i>
            Commission Settings
          </button>
          <button
            className="btn btn-secondary flex items-center"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            <i className="fas fa-file-download mr-2"></i>
            Generate Report
          </button>
          <button
            className="btn btn-primary flex items-center"
            onClick={() => setShowAddRepModal(true)}
          >
            <i className="fas fa-user-plus mr-2"></i>
            Add Sales Rep
          </button>
          <button
            className="btn btn-primary flex items-center"
            onClick={handleBulkPayment}
            disabled={loading || selectedReps.length === 0}
          >
            <i className="fas fa-money-check-alt mr-2"></i>
            Process Payments ({selectedReps.length})
          </button>
        </div>
      </div>

      {/* Commission Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="dashboard-card bg-gradient-blue">
          <div className="card-body">
            <i className="fas fa-dollar-sign card-icon"></i>
            <h5 className="card-title">Current Period</h5>
            <p className="text-3xl font-bold mt-2">{formatCurrency(currentPeriod.pendingCommission)}</p>
            <p className="text-sm mt-1 opacity-90">{currentPeriod.loadCount} Loads</p>
            <div className="mt-3 bg-blue-200 bg-opacity-30 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        <div className="dashboard-card bg-gradient-green">
          <div className="card-body">
            <i className="fas fa-users card-icon"></i>
            <h5 className="card-title">Active Sales Reps</h5>
            <p className="text-3xl font-bold mt-2">{totalActiveReps}</p>
            <p className="text-sm mt-1 opacity-90">Avg Rate: {averageCommissionRate.toFixed(1)}%</p>
            <div className="mt-3 bg-green-200 bg-opacity-30 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        <div className="dashboard-card bg-gradient-purple">
          <div className="card-body">
            <i className="fas fa-chart-line card-icon"></i>
            <h5 className="card-title">Total Revenue</h5>
            <p className="text-3xl font-bold mt-2">{formatCurrency(currentPeriod.totalRevenue)}</p>
            <p className="text-sm mt-1 opacity-90">This Period</p>
            <div className="mt-3 bg-purple-200 bg-opacity-30 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>

        <div className="dashboard-card bg-gradient-orange">
          <div className="card-body">
            <i className="fas fa-percentage card-icon"></i>
            <h5 className="card-title">Commission Rate</h5>
            <p className="text-3xl font-bold mt-2">{((currentPeriod.totalCommission / currentPeriod.totalRevenue) * 100).toFixed(1)}%</p>
            <p className="text-sm mt-1 opacity-90">Effective Rate</p>
            <div className="mt-3 bg-orange-200 bg-opacity-30 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Representatives Section */}
      <Card className="shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold flex items-center mb-4 md:mb-0">
            <i className="fas fa-user-tie mr-2 text-blue-600"></i>
            Sales Representatives
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search reps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReps.map((rep) => (
            <div key={rep.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedReps.includes(rep.id)}
                  onChange={() => toggleRepSelection(rep.id)}
                />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {rep.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{rep.name}</h3>
                    <p className="text-sm text-gray-500">{rep.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(rep.status)}`}>
                  {rep.status.charAt(0).toUpperCase() + rep.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Commission Rate</p>
                  <p className="text-xl font-bold text-gray-900">{rep.commissionRate}%</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Loads</p>
                  <p className="text-xl font-bold text-blue-900">{rep.totalLoads}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold text-green-900">{formatCurrency(rep.totalRevenue)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Commission</p>
                  <p className="text-xl font-bold text-purple-900">{formatCurrency(rep.totalCommission)}</p>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <p className="text-sm text-gray-500">Member since {new Date(rep.hireDate).toLocaleDateString()}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewRepDetails(rep)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditCommissionRate(rep)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Edit Rate
                  </button>
                  <button
                    onClick={() => handleProcessPayment(rep)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Commissionable Loads */}
      <Card className="shadow-sm mb-8">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fas fa-truck mr-2 text-blue-600"></i>
            Recent Commissionable Loads
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Load #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Rep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentLoads.map((load) => (
                <tr key={load.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {load.loadNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {load.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div>
                      <p>{load.origin}</p>
                      <p className="text-gray-500">→ {load.destination}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {load.salesRep}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(load.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {load.commissionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(load.commissionAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(load.status)}`}>
                      {load.status.charAt(0).toUpperCase() + load.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Commission History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-history mr-2 text-blue-600"></i>
            Commission History
          </h2>

          <Card className="shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loads
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commissionPeriods.map((period, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {period.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        {formatCurrency(period.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        {formatCurrency(period.totalCommission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                        {formatCurrency(period.paidCommission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 text-right font-medium">
                        {formatCurrency(period.pendingCommission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        {period.loadCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-cog mr-2 text-blue-600"></i>
            Commission Settings
          </h2>

          <Card className="shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Commission Structure</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Base Rate (0-100K)</span>
                    <span className="text-sm font-medium">6%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Tier 1 (100K-250K)</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Tier 2 (250K-500K)</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Tier 3 (500K+)</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Schedule</h3>
                <p className="text-sm text-gray-600">Commissions are calculated monthly and paid on the 15th of the following month.</p>
              </div>

              <div className="pt-4 border-t">
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Edit Commission Settings
                </button>
                <button 
                  onClick={() => {
                    setSelectedPeriod('current');
                    toast.success('Showing current period data');
                  }}
                  className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sales Rep Details Modal */}
      <Modal
        isOpen={showRepModal}
        onClose={() => {
          setShowRepModal(false);
          setSelectedRep(null);
        }}
        title={selectedRep?.name || 'Sales Representative Details'}
        size="lg"
      >
        {selectedRep && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedRep.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedRep.name}</h3>
                  <p className="text-gray-600">{selectedRep.email}</p>
                  <p className="text-gray-600">{selectedRep.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedRep.status)}`}>
                    {selectedRep.status.charAt(0).toUpperCase() + selectedRep.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <p className="font-medium">{new Date(selectedRep.hireDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Commission Rate</p>
                  <p className="font-medium text-lg">{selectedRep.commissionRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Loads</p>
                  <p className="font-medium text-lg">{selectedRep.totalLoads}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600">Total Revenue Generated</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(selectedRep.totalRevenue)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600">Total Commission Earned</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(selectedRep.totalCommission)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Current Period Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Loads This Month</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue This Month</span>
                  <span className="font-medium">{formatCurrency(78500)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Commission This Month</span>
                  <span className="font-medium text-green-600">{formatCurrency(78500 * selectedRep.commissionRate / 100)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Load Value</span>
                  <span className="font-medium">{formatCurrency(78500 / 24)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowRepModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowRepModal(false);
                  setShowPaymentModal(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Process Payment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Commission Rate Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedRep(null);
        }}
        title="Edit Commission Rate"
        size="md"
      >
        {selectedRep && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Sales Representative</p>
              <p className="font-semibold">{selectedRep.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Commission Rate
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  defaultValue={selectedRep.commissionRate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective Date
              </label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Change
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter reason for commission rate change..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const rateInput = document.querySelector('input[type="number"][step="0.5"]') as HTMLInputElement;
                  const newRate = parseFloat(rateInput?.value || selectedRep.commissionRate.toString());
                  handleSaveCommissionRate(selectedRep, newRate);
                }}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Process Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedRep(null);
        }}
        title="Process Commission Payment"
        size="md"
      >
        {selectedRep && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Processing payment for</p>
              <p className="font-semibold text-blue-900">{selectedRep.name}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Period Commission</span>
                <span className="font-medium">{formatCurrency(6280)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Previous Balance</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-medium text-gray-900">Total Payment</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(6280)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Direct Deposit (ACH)</option>
                <option>Check</option>
                <option>Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Notes
              </label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional payment notes..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                This action will process a payment of {formatCurrency(6280)} to {selectedRep.name}.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcessPayment(selectedRep)}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Process Payment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Sales Rep Modal */}
      <Modal
        isOpen={showAddRepModal}
        onClose={() => setShowAddRepModal(false)}
        title="Add New Sales Representative"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const repData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            commissionRate: formData.get('commissionRate')
          };
          handleAddSalesRep(repData);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <input
                type="number"
                name="commissionRate"
                min="0"
                max="100"
                step="0.5"
                defaultValue="8"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddRepModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Sales Rep
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Export Report Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Commission Report"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Your commission report has been generated. Choose export format:</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                toast.success('Downloading PDF report...');
                setShowExportModal(false);
              }}
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <i className="fas fa-file-pdf text-red-500 text-3xl mb-2"></i>
              <p className="font-medium">PDF Report</p>
              <p className="text-sm text-gray-500">Formatted for printing</p>
            </button>

            <button
              onClick={() => {
                toast.success('Downloading Excel report...');
                setShowExportModal(false);
              }}
              className="p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <i className="fas fa-file-excel text-green-500 text-3xl mb-2"></i>
              <p className="font-medium">Excel Report</p>
              <p className="text-sm text-gray-500">For further analysis</p>
            </button>
          </div>

          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Report To:
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="accounting@company.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => {
                  toast.success('Report sent via email');
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Commissions;