import React, { useState } from 'react';
import { Card, Modal } from '../../../components';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';

// Report types for shippers
type ReportType = 'spend' | 'otd' | 'carrier' | 'lane' | 'claims' | 'volume' | 'cost_analysis' | 'compliance';
type DateRangeType = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';
type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  icon: string;
  color: string;
  isPopular?: boolean;
}

interface GeneratedReport {
  id: string;
  name: string;
  type: ReportType;
  dateRange: string;
  metrics: string[];
  createdAt: string;
  fileSize: string;
  status: 'completed' | 'processing' | 'failed';
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('spend');
  const [dateRange, setDateRange] = useState<DateRangeType>('last30days');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'templates' | 'generated'>('overview');
  const [reportName, setReportName] = useState('');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: '1',
      name: 'Q1 2025 Freight Spend Analysis',
      type: 'spend',
      dateRange: 'Jan 1 - Mar 31, 2025',
      metrics: ['totalSpend', 'avgCostPerLoad', 'costPerMile'],
      createdAt: '2025-04-05 09:30 AM',
      fileSize: '2.4 MB',
      status: 'completed'
    },
    {
      id: '2',
      name: 'March Carrier Performance Report',
      type: 'carrier',
      dateRange: 'Mar 1 - Mar 31, 2025',
      metrics: ['otdPercentage', 'carrierUtilization', 'transitTime'],
      createdAt: '2025-04-01 02:15 PM',
      fileSize: '1.8 MB',
      status: 'completed'
    }
  ]);

  // Report templates for shippers
  const reportTemplates: ReportTemplate[] = [
    { id: '1', name: 'Total Freight Spend', description: 'Track shipping costs and budget analysis', type: 'spend', icon: 'fa-dollar-sign', color: 'green', isPopular: true },
    { id: '2', name: 'On-Time Delivery', description: 'Monitor delivery performance by carrier', type: 'otd', icon: 'fa-clock', color: 'blue', isPopular: true },
    { id: '3', name: 'Carrier Performance', description: 'Evaluate carrier reliability and ratings', type: 'carrier', icon: 'fa-truck', color: 'purple' },
    { id: '4', name: 'Lane Analysis', description: 'Cost and volume analysis by shipping lanes', type: 'lane', icon: 'fa-route', color: 'indigo' },
    { id: '5', name: 'Claims & Exceptions', description: 'Track damage claims and service failures', type: 'claims', icon: 'fa-exclamation-triangle', color: 'red', isPopular: true },
    { id: '6', name: 'Shipment Volume', description: 'Volume trends and seasonal patterns', type: 'volume', icon: 'fa-chart-bar', color: 'yellow' },
    { id: '7', name: 'Cost per Mile', description: 'Analyze shipping costs by distance', type: 'cost_analysis', icon: 'fa-calculator', color: 'pink' },
    { id: '8', name: 'Compliance Report', description: 'Documentation and regulatory compliance', type: 'compliance', icon: 'fa-clipboard-check', color: 'orange' }
  ];

  // Mock data for shipper reports
  const spendData = [
    { month: 'Jan', spend: 185000, shipments: 142, avgCost: 1303 },
    { month: 'Feb', spend: 198000, shipments: 168, avgCost: 1179 },
    { month: 'Mar', spend: 212000, shipments: 185, avgCost: 1146 },
    { month: 'Apr', spend: 195000, shipments: 164, avgCost: 1189 },
    { month: 'May', spend: 232000, shipments: 192, avgCost: 1208 },
    { month: 'Jun', spend: 276500, shipments: 208, avgCost: 1329 }
  ];

  const carrierSpendDistribution = [
    { name: 'Shanahan Transportation', value: 35, spend: 96775 },
    { name: 'Swift Logistics', value: 28, spend: 77420 },
    { name: 'JB Hunt', value: 20, spend: 55300 },
    { name: 'Werner Enterprises', value: 10, spend: 27650 },
    { name: 'Others', value: 7, spend: 19355 }
  ];

  const onTimeDeliveryData = [
    { carrier: 'Shanahan', otd: 96, total: 125, late: 5 },
    { carrier: 'Swift', otd: 94, total: 98, late: 6 },
    { carrier: 'JB Hunt', otd: 92, total: 76, late: 6 },
    { carrier: 'Werner', otd: 95, total: 54, late: 3 },
    { carrier: 'Schneider', otd: 93, total: 41, late: 3 }
  ];

  const laneVolumeData = [
    { lane: 'Chicago-Atlanta', volume: 45, avgCost: 3200, totalSpend: 144000 },
    { lane: 'Detroit-Houston', volume: 38, avgCost: 2950, totalSpend: 112100 },
    { lane: 'Milwaukee-Nashville', volume: 32, avgCost: 2650, totalSpend: 84800 },
    { lane: 'Cleveland-Charlotte', volume: 28, avgCost: 2100, totalSpend: 58800 },
    { lane: 'Pittsburgh-Richmond', volume: 22, avgCost: 1850, totalSpend: 40700 }
  ];

  const claimsData = [
    { month: 'Jan', claims: 2, value: 4500 },
    { month: 'Feb', claims: 1, value: 2200 },
    { month: 'Mar', claims: 3, value: 6800 },
    { month: 'Apr', claims: 1, value: 1500 },
    { month: 'May', claims: 2, value: 3900 },
    { month: 'Jun', claims: 0, value: 0 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Available metrics for shipper reports
  const availableMetrics = [
    { id: 'totalSpend', label: 'Total Freight Spend', category: 'Financial' },
    { id: 'avgCostPerLoad', label: 'Average Cost per Load', category: 'Financial' },
    { id: 'costPerMile', label: 'Cost per Mile', category: 'Financial' },
    { id: 'shipmentVolume', label: 'Shipment Volume', category: 'Operational' },
    { id: 'otdPercentage', label: 'On-Time Delivery %', category: 'Performance' },
    { id: 'claimsRatio', label: 'Claims Ratio', category: 'Performance' },
    { id: 'carrierUtilization', label: 'Carrier Utilization', category: 'Operational' },
    { id: 'transitTime', label: 'Average Transit Time', category: 'Performance' },
    { id: 'fuelSurcharge', label: 'Fuel Surcharge Trends', category: 'Financial' },
    { id: 'accessorialCharges', label: 'Accessorial Charges', category: 'Financial' }
  ];

  const handleGenerateReport = () => {
    if (!reportName.trim()) {
      toast.error('Please enter a report name');
      return;
    }
    
    setIsGenerating(true);
    toast.loading('Generating report...');
    
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: reportName,
        type: reportType,
        dateRange: getDateRangeLabel(dateRange),
        metrics: selectedMetrics,
        createdAt: new Date().toLocaleString(),
        fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        status: 'completed'
      };
      
      setGeneratedReports([newReport, ...generatedReports]);
      setIsGenerating(false);
      toast.dismiss();
      toast.success('Report generated successfully!');
      setShowCreateModal(false);
      setReportName('');
      setSelectedMetrics([]);
      setActiveTab('generated');
    }, 3000);
  };
  
  const getDateRangeLabel = (range: DateRangeType): string => {
    const today = new Date();
    switch (range) {
      case 'last7days':
        return `${new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${today.toLocaleDateString()}`;
      case 'last30days':
        return `${new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${today.toLocaleDateString()}`;
      case 'thisMonth':
        return `${new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString()} - ${today.toLocaleDateString()}`;
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return `${lastMonth.toLocaleDateString()} - ${new Date(today.getFullYear(), today.getMonth(), 0).toLocaleDateString()}`;
      case 'thisQuarter':
        const quarter = Math.floor(today.getMonth() / 3);
        const startMonth = quarter * 3;
        return `${new Date(today.getFullYear(), startMonth, 1).toLocaleDateString()} - ${today.toLocaleDateString()}`;
      case 'thisYear':
        return `Jan 1, ${today.getFullYear()} - ${today.toLocaleDateString()}`;
      default:
        return 'Custom Range';
    }
  };

  const handleScheduleReport = () => {
    toast.success('Report scheduled successfully');
    setShowScheduleModal(false);
  };

  const handleExportReport = (format: ExportFormat, reportId?: string) => {
    const reportName = reportId ? generatedReports.find(r => r.id === reportId)?.name : 'report';
    toast.success(`Exporting ${reportName} as ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success('Report exported successfully!');
      // In a real app, this would trigger a download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${reportName}.${format}`;
      link.click();
    }, 2000);
  };
  
  const handleDeleteReport = (reportId: string) => {
    setGeneratedReports(generatedReports.filter(r => r.id !== reportId));
    toast.success('Report deleted successfully');
  };

  const CreateReportModal = () => (
    <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Custom Report</h2>
        
        <div className="space-y-6">
          {/* Report Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
            <input
              type="text"
              placeholder="e.g., Q2 Shipping Cost Analysis"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Metrics</label>
            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableMetrics.map(metric => (
                <label key={metric.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMetrics([...selectedMetrics, metric.id]);
                      } else {
                        setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{metric.label}</span>
                  <span className="ml-auto text-xs text-gray-500">{metric.category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || selectedMetrics.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipping Reports & Analytics</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 flex items-center"
          >
            <i className="fas fa-calendar-alt mr-2"></i> Schedule Report
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm flex items-center"
          >
            <i className="fas fa-plus-circle mr-2"></i> Create Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'detailed', 'templates', 'generated'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Freight Spend Chart */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Total Freight Spend</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleExportReport('pdf')} className="text-gray-500 hover:text-gray-700">
                    <i className="fas fa-file-pdf"></i>
                  </button>
                  <button onClick={() => handleExportReport('excel')} className="text-gray-500 hover:text-gray-700">
                    <i className="fas fa-file-excel"></i>
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={spendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="spend" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Carrier Spend Distribution */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Spend by Carrier</h3>
                <span className="text-sm text-gray-500">MTD</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={carrierSpendDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {carrierSpendDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* On-Time Delivery Performance */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">On-Time Delivery by Carrier</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={onTimeDeliveryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="carrier" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="otd" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Claims Trend */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Claims & Exceptions Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={claimsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="claims" stroke="#EF4444" name="Claim Count" />
                  <Line yAxisId="right" type="monotone" dataKey="value" stroke="#F59E0B" name="Claim Value ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Detailed Tab */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Lane Volume & Cost Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lane
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spend
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost/Mile
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {laneVolumeData.map((lane, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lane.lane}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lane.volume} loads
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${lane.avgCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${lane.totalSpend.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          $2.45/mi
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <h4 className="text-sm font-medium text-gray-500">Total Spend (YTD)</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">$1,298,500</p>
              <p className="text-sm text-green-600 mt-1">-8% vs last year</p>
            </Card>
            <Card className="p-6">
              <h4 className="text-sm font-medium text-gray-500">Average OTD</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">94.2%</p>
              <p className="text-sm text-green-600 mt-1">+2.3% improvement</p>
            </Card>
            <Card className="p-6">
              <h4 className="text-sm font-medium text-gray-500">Claims Ratio</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">0.8%</p>
              <p className="text-sm text-gray-500 mt-1">9 claims YTD</p>
            </Card>
            <Card className="p-6">
              <h4 className="text-sm font-medium text-gray-500">Avg Cost/Load</h4>
              <p className="text-2xl font-bold text-gray-900 mt-2">$1,246</p>
              <p className="text-sm text-red-600 mt-1">+3.2% vs last year</p>
            </Card>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-${template.color}-100`}>
                    <i className={`fas ${template.icon} text-${template.color}-600 text-xl`}></i>
                  </div>
                  {template.isPopular && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mt-4">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                <button
                  onClick={() => {
                    setReportType(template.type);
                    setReportName(template.name + ' - ' + new Date().toLocaleDateString());
                    setSelectedMetrics(['totalSpend', 'avgCostPerLoad', 'shipmentVolume']);
                    setShowCreateModal(true);
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Generated Reports Tab */}
      {activeTab === 'generated' && (
        <div>
          {generatedReports.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-file-alt text-gray-300 text-5xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Generated</h3>
              <p className="text-gray-500 mb-4">Create your first custom report to see it here</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Create Report
              </button>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Range
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generatedReports.map((report) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500">
                            {report.metrics.length} metrics included
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {reportTemplates.find(t => t.type === report.type)?.name || report.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.dateRange}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.fileSize}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.status === 'completed' ? 'bg-green-100 text-green-800' :
                            report.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => toast.success('Opening report preview...')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleExportReport('pdf', report.id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Download PDF"
                            >
                              <i className="fas fa-file-pdf"></i>
                            </button>
                            <button
                              onClick={() => handleExportReport('excel', report.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Download Excel"
                            >
                              <i className="fas fa-file-excel"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateReportModal />

      {/* Schedule Report Modal */}
      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Report</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                {reportTemplates.map(template => (
                  <option key={template.id} value={template.type}>{template.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <input
                type="email"
                placeholder="Enter email addresses separated by commas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;