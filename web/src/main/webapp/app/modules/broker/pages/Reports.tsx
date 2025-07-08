import React, { useState } from 'react';
import { Card, Modal } from '../../../components';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Report types
type ReportType = 'revenue' | 'margin' | 'customer' | 'carrier' | 'lane' | 'commission' | 'profitability' | 'operational';
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
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<ReportType>('revenue');
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
      name: 'Q1 2025 Revenue Analysis',
      type: 'revenue',
      dateRange: 'Jan 1 - Mar 31, 2025',
      metrics: ['revenue', 'profit', 'margin'],
      createdAt: '2025-04-05 09:30 AM',
      fileSize: '2.4 MB',
      status: 'completed'
    },
    {
      id: '2',
      name: 'March Commission Report',
      type: 'commission',
      dateRange: 'Mar 1 - Mar 31, 2025',
      metrics: ['commission', 'salesRep', 'loadCount'],
      createdAt: '2025-04-01 02:15 PM',
      fileSize: '1.8 MB',
      status: 'completed'
    }
  ]);

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    { id: '1', name: 'Revenue Analysis', description: 'Track revenue trends and growth metrics', type: 'revenue', icon: 'fa-dollar-sign', color: 'green', isPopular: true },
    { id: '2', name: 'Margin Report', description: 'Analyze profit margins across loads and lanes', type: 'margin', icon: 'fa-chart-line', color: 'blue', isPopular: true },
    { id: '3', name: 'Customer Performance', description: 'Evaluate customer relationships and revenue', type: 'customer', icon: 'fa-users', color: 'purple' },
    { id: '4', name: 'Carrier Analytics', description: 'Monitor carrier performance and ratings', type: 'carrier', icon: 'fa-truck', color: 'indigo' },
    { id: '5', name: 'Lane Analysis', description: 'Identify most profitable lanes and routes', type: 'lane', icon: 'fa-route', color: 'yellow', isPopular: true },
    { id: '6', name: 'Commission Report', description: 'Sales team commissions and performance', type: 'commission', icon: 'fa-percentage', color: 'pink' },
    { id: '7', name: 'Profitability Dashboard', description: 'Comprehensive P&L analysis', type: 'profitability', icon: 'fa-chart-pie', color: 'red' },
    { id: '8', name: 'Operational Metrics', description: 'Load counts, on-time delivery, and efficiency', type: 'operational', icon: 'fa-tachometer-alt', color: 'orange' }
  ];

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 245000, profit: 48000, loads: 142 },
    { month: 'Feb', revenue: 298000, profit: 59600, loads: 168 },
    { month: 'Mar', revenue: 312000, profit: 65520, loads: 185 },
    { month: 'Apr', revenue: 285000, profit: 57000, loads: 164 },
    { month: 'May', revenue: 342000, profit: 71820, loads: 192 },
    { month: 'Jun', revenue: 378000, profit: 83160, loads: 208 }
  ];

  const marginData = [
    { lane: 'Chicago-Atlanta', margin: 22, revenue: 125000 },
    { lane: 'Dallas-Phoenix', margin: 18, revenue: 98000 },
    { lane: 'Miami-New York', margin: 25, revenue: 156000 },
    { lane: 'Seattle-Denver', margin: 20, revenue: 87000 },
    { lane: 'LA-Chicago', margin: 23, revenue: 142000 }
  ];

  const customerDistribution = [
    { name: 'Enterprise', value: 45, count: 12 },
    { name: 'Mid-Market', value: 30, count: 28 },
    { name: 'Small Business', value: 25, count: 45 }
  ];

  const carrierPerformance = [
    { metric: 'On-Time Delivery', A: 95, B: 88, fullMark: 100 },
    { metric: 'Communication', A: 92, B: 85, fullMark: 100 },
    { metric: 'Documentation', A: 88, B: 90, fullMark: 100 },
    { metric: 'Rate Competitiveness', A: 85, B: 92, fullMark: 100 },
    { metric: 'Overall Rating', A: 94, B: 89, fullMark: 100 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Available metrics for custom reports
  const availableMetrics = [
    { id: 'revenue', label: 'Total Revenue', category: 'Financial' },
    { id: 'profit', label: 'Gross Profit', category: 'Financial' },
    { id: 'margin', label: 'Profit Margin %', category: 'Financial' },
    { id: 'loads', label: 'Load Count', category: 'Operational' },
    { id: 'miles', label: 'Total Miles', category: 'Operational' },
    { id: 'rpm', label: 'Revenue per Mile', category: 'Financial' },
    { id: 'otd', label: 'On-Time Delivery %', category: 'Performance' },
    { id: 'claims', label: 'Claims Ratio', category: 'Performance' },
    { id: 'dso', label: 'Days Sales Outstanding', category: 'Financial' },
    { id: 'utilization', label: 'Fleet Utilization %', category: 'Operational' }
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
              placeholder="e.g., Q2 Revenue Analysis"
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

          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Metrics</label>
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {Object.entries(
                availableMetrics.reduce((acc, metric) => {
                  if (!acc[metric.category]) acc[metric.category] = [];
                  acc[metric.category].push(metric);
                  return acc;
                }, {} as Record<string, typeof availableMetrics>)
              ).map(([category, metrics]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">{category}</h4>
                  {metrics.map(metric => (
                    <label key={metric.id} className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMetrics([...selectedMetrics, metric.id]);
                          } else {
                            setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{metric.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Grouping Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="none">No Grouping</option>
              <option value="customer">Customer</option>
              <option value="carrier">Carrier</option>
              <option value="lane">Lane</option>
              <option value="salesRep">Sales Rep</option>
              <option value="equipment">Equipment Type</option>
            </select>
          </div>

          {/* Report Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
            <div className="grid grid-cols-3 gap-4">
              <button className="px-4 py-3 border-2 border-blue-500 bg-blue-50 rounded-lg text-blue-700 font-medium hover:bg-blue-100 transition-colors">
                <i className="fas fa-table mb-2 text-2xl block"></i>
                Table View
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="fas fa-chart-bar mb-2 text-2xl block"></i>
                Chart View
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="fas fa-th mb-2 text-2xl block"></i>
                Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || selectedMetrics.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );

  const ScheduleReportModal = () => (
    <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Report</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Template</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {reportTemplates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              defaultValue="09:00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-sm">PDF</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-sm">Excel</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-sm">CSV</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={() => setShowScheduleModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleScheduleReport}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Schedule Report
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate insights and track your brokerage performance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <i className="fas fa-clock mr-2"></i>
            Schedule
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Create Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview Dashboard
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'detailed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Detailed Reports
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Report Templates
          </button>
          <button
            onClick={() => setActiveTab('generated')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generated'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generated Reports
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">$1.85M</p>
                    <p className="text-blue-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i>
                      18.2% vs last month
                    </p>
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-dollar-sign text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Profit Margin</p>
                    <p className="text-3xl font-bold mt-2">21.3%</p>
                    <p className="text-green-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i>
                      2.1% improvement
                    </p>
                  </div>
                  <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-chart-line text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Active Loads</p>
                    <p className="text-3xl font-bold mt-2">342</p>
                    <p className="text-purple-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i>
                      56 more than last week
                    </p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-truck text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">On-Time Delivery</p>
                    <p className="text-3xl font-bold mt-2">94.2%</p>
                    <p className="text-orange-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-minus mr-1"></i>
                      0.8% from target
                    </p>
                  </div>
                  <div className="bg-orange-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-clock text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue & Profit Trend */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Revenue & Profit Trend</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">6M</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">1Y</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">ALL</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Lanes by Margin */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Lanes by Margin</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marginData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="lane" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="margin" fill="#3B82F6">
                      {marginData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Customer Distribution */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {customerDistribution.map((segment, index) => (
                    <div key={segment.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-sm text-gray-600">{segment.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{segment.count} customers</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Carrier Performance Radar */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Carrier Performance Comparison</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={carrierPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Top Carrier" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Radar name="Average Carrier" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Detailed Reports Tab */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          {/* Recent Reports */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Q2 Revenue Analysis', type: 'Revenue', date: 'Jun 28, 2025', size: '2.4 MB' },
                  { name: 'May Commission Report', type: 'Commission', date: 'Jun 1, 2025', size: '1.8 MB' },
                  { name: 'Weekly Operational Metrics', type: 'Operational', date: 'Jun 26, 2025', size: '3.1 MB' },
                  { name: 'Customer Performance Review', type: 'Customer', date: 'Jun 15, 2025', size: '2.2 MB' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-lg p-3 mr-4">
                        <i className="fas fa-file-alt text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-500">{report.type} • {report.date} • {report.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExportReport('pdf')}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-share"></i>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Scheduled Reports</h2>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add Schedule
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Run</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: 'Daily Revenue Summary', frequency: 'Daily', recipients: 'team@company.com', nextRun: 'Tomorrow 9:00 AM', status: 'active' },
                      { name: 'Weekly Performance Report', frequency: 'Weekly', recipients: 'management@company.com', nextRun: 'Monday 8:00 AM', status: 'active' },
                      { name: 'Monthly P&L Statement', frequency: 'Monthly', recipients: 'cfo@company.com', nextRun: 'Jul 1, 2025', status: 'paused' }
                    ].map((schedule, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.frequency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.recipients}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.nextRun}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {schedule.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-${template.color}-100 text-${template.color}-600 rounded-lg p-3`}>
                    <i className={`fas ${template.icon} text-2xl`}></i>
                  </div>
                  {template.isPopular && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setReportType(template.type);
                      setReportName(template.name + ' - ' + new Date().toLocaleDateString());
                      setSelectedMetrics(['revenue', 'profit', 'margin']);
                      setShowCreateModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Use Template
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
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
      <ScheduleReportModal />
    </div>
  );
};

export default Reports;