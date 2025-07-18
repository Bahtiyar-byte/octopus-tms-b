import React, { useState } from 'react';
import { Card, Modal } from '../../../../components';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from 'react-hot-toast';

// Report types for carriers
type ReportType = 'fleet' | 'driver' | 'fuel' | 'maintenance' | 'safety' | 'revenue' | 'utilization' | 'compliance';
export type DateRangeType = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';
export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  icon: string;
  color: string;
  isPopular?: boolean;
}

export interface GeneratedReport {
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
  const [reportType, setReportType] = useState<ReportType>('fleet');
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
      name: 'Q1 2025 Fleet Performance Report',
      type: 'fleet',
      dateRange: 'Jan 1 - Mar 31, 2025',
      metrics: ['utilization', 'revenue', 'miles'],
      createdAt: '2025-04-05 09:30 AM',
      fileSize: '2.8 MB',
      status: 'completed'
    },
    {
      id: '2',
      name: 'March Driver Safety Analysis',
      type: 'safety',
      dateRange: 'Mar 1 - Mar 31, 2025',
      metrics: ['incidents', 'violations', 'scores'],
      createdAt: '2025-04-01 02:15 PM',
      fileSize: '1.5 MB',
      status: 'completed'
    }
  ]);

  // Report templates for carriers
  const reportTemplates: ReportTemplate[] = [
    { id: '1', name: 'Fleet Performance', description: 'Track truck utilization and efficiency', type: 'fleet', icon: 'fa-truck', color: 'blue', isPopular: true },
    { id: '2', name: 'Driver Performance', description: 'Monitor driver metrics and productivity', type: 'driver', icon: 'fa-user-tie', color: 'green', isPopular: true },
    { id: '3', name: 'Fuel Efficiency', description: 'Analyze fuel consumption and costs', type: 'fuel', icon: 'fa-gas-pump', color: 'yellow' },
    { id: '4', name: 'Maintenance Report', description: 'Vehicle maintenance schedules and costs', type: 'maintenance', icon: 'fa-tools', color: 'orange' },
    { id: '5', name: 'Safety & Compliance', description: 'CSA scores, violations, and incidents', type: 'safety', icon: 'fa-shield-alt', color: 'red', isPopular: true },
    { id: '6', name: 'Revenue Analysis', description: 'Income per truck, lane, and driver', type: 'revenue', icon: 'fa-dollar-sign', color: 'green' },
    { id: '7', name: 'Equipment Utilization', description: 'Track trailer and truck usage rates', type: 'utilization', icon: 'fa-chart-area', color: 'purple' },
    { id: '8', name: 'DOT Compliance', description: 'Hours of service and inspection reports', type: 'compliance', icon: 'fa-clipboard-check', color: 'indigo' }
  ];

  // Mock data for carrier reports
  const fleetData = [
    { month: 'Jan', miles: 245000, revenue: 384000, utilization: 88 },
    { month: 'Feb', miles: 268000, revenue: 418000, utilization: 92 },
    { month: 'Mar', miles: 282000, revenue: 445000, utilization: 91 },
    { month: 'Apr', miles: 265000, revenue: 412000, utilization: 87 },
    { month: 'May', miles: 298000, revenue: 468000, utilization: 94 },
    { month: 'Jun', miles: 312000, revenue: 492000, utilization: 95 }
  ];

  const driverPerformanceData = [
    { driver: 'John Smith', miles: 12500, revenue: 19800, safety: 98, onTime: 96 },
    { driver: 'Mike Johnson', miles: 11800, revenue: 18200, safety: 95, onTime: 94 },
    { driver: 'David Brown', miles: 13200, revenue: 20500, safety: 99, onTime: 97 },
    { driver: 'Tom Wilson', miles: 10900, revenue: 16800, safety: 93, onTime: 91 },
    { driver: 'James Davis', miles: 12100, revenue: 18900, safety: 97, onTime: 95 }
  ];

  const fuelEfficiencyData = [
    { name: 'Fleet Average', value: 6.8, target: 7.0 },
    { name: 'Best Performer', value: 7.5, target: 7.0 },
    { name: 'Worst Performer', value: 5.9, target: 7.0 }
  ];

  const maintenanceData = [
    { type: 'Preventive', count: 45, cost: 28500 },
    { type: 'Repairs', count: 12, cost: 18200 },
    { type: 'Tires', count: 28, cost: 14800 },
    { type: 'Emergency', count: 3, cost: 8500 }
  ];

  const safetyScores = [
    { category: 'Unsafe Driving', score: 15, threshold: 65 },
    { category: 'Hours-of-Service', score: 20, threshold: 65 },
    { category: 'Vehicle Maintenance', score: 25, threshold: 80 },
    { category: 'Controlled Substances', score: 0, threshold: 80 },
    { category: 'Hazmat Compliance', score: 10, threshold: 80 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Available metrics for carrier reports
  const availableMetrics = [
    { id: 'utilization', label: 'Fleet Utilization %', category: 'Fleet' },
    { id: 'revenue', label: 'Revenue per Truck', category: 'Financial' },
    { id: 'miles', label: 'Total Miles Driven', category: 'Operational' },
    { id: 'fuelEfficiency', label: 'Fuel Efficiency (MPG)', category: 'Fleet' },
    { id: 'driverHours', label: 'Driver Hours Logged', category: 'Compliance' },
    { id: 'incidents', label: 'Safety Incidents', category: 'Safety' },
    { id: 'violations', label: 'DOT Violations', category: 'Compliance' },
    { id: 'scores', label: 'CSA Scores', category: 'Safety' },
    { id: 'maintenanceCost', label: 'Maintenance Cost', category: 'Fleet' },
    { id: 'onTimeDelivery', label: 'On-Time Delivery %', category: 'Performance' }
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
        // eslint-disable-next-line no-case-declarations
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return `${lastMonth.toLocaleDateString()} - ${new Date(today.getFullYear(), today.getMonth(), 0).toLocaleDateString()}`;
      case 'thisQuarter':
        // eslint-disable-next-line no-case-declarations
        const quarter = Math.floor(today.getMonth() / 3);
        // eslint-disable-next-line no-case-declarations
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
              placeholder="e.g., Q2 Fleet Performance Analysis"
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
              <option value="driver">Driver</option>
              <option value="truck">Truck</option>
              <option value="route">Route</option>
              <option value="customer">Customer</option>
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
          <h1 className="text-2xl font-bold text-gray-900">Fleet Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor fleet performance and driver metrics</p>
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
                    <p className="text-blue-100 text-sm font-medium">Fleet Utilization</p>
                    <p className="text-3xl font-bold mt-2">91.5%</p>
                    <p className="text-blue-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i>
                      3.2% vs last month
                    </p>
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-truck text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Revenue/Truck</p>
                    <p className="text-3xl font-bold mt-2">$24.5K</p>
                    <p className="text-green-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i>
                      $2.1K increase
                    </p>
                  </div>
                  <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-dollar-sign text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Avg MPG</p>
                    <p className="text-3xl font-bold mt-2">6.8</p>
                    <p className="text-yellow-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i>
                      0.3 improvement
                    </p>
                  </div>
                  <div className="bg-yellow-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-gas-pump text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Safety Score</p>
                    <p className="text-3xl font-bold mt-2">96.2</p>
                    <p className="text-purple-100 text-sm mt-2 flex items-center">
                      <i className="fas fa-check mr-1"></i>
                      Above target
                    </p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 rounded-lg p-3">
                    <i className="fas fa-shield-alt text-2xl"></i>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Fleet Performance Trend */}
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Fleet Performance Trend</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">6M</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">1Y</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">ALL</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={fleetData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                  <Area yAxisId="right" type="monotone" dataKey="miles" stroke="#10B981" fillOpacity={1} fill="url(#colorMiles)" name="Miles" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver Performance Rankings */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Driver Performance</h2>
                <div className="space-y-4">
                  {driverPerformanceData.map((driver, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{driver.driver}</p>
                          <p className="text-sm text-gray-500">{driver.miles.toLocaleString()} miles • ${driver.revenue.toLocaleString()} revenue</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Safety</p>
                          <p className="font-semibold text-green-600">{driver.safety}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">On-Time</p>
                          <p className="font-semibold text-blue-600">{driver.onTime}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* CSA Scores */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">CSA Scores Overview</h2>
                <div className="space-y-4">
                  {safetyScores.map((score, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{score.category}</span>
                        <span className={`text-sm font-semibold ${score.score < score.threshold ? 'text-green-600' : 'text-red-600'}`}>
                          {score.score} / {score.threshold}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${score.score < score.threshold ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${(score.score / score.threshold) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Maintenance Overview */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Maintenance Cost Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={maintenanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.type}: $${entry.cost.toLocaleString()}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="cost"
                  >
                    {maintenanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
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
                  { name: 'June Fleet Performance Report', type: 'Fleet', date: 'Jun 28, 2025', size: '3.2 MB' },
                  { name: 'Driver Safety Analysis', type: 'Safety', date: 'Jun 25, 2025', size: '1.8 MB' },
                  { name: 'Weekly Fuel Efficiency Report', type: 'Fuel', date: 'Jun 26, 2025', size: '2.5 MB' },
                  { name: 'Q2 Maintenance Summary', type: 'Maintenance', date: 'Jun 15, 2025', size: '4.1 MB' }
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
                      { name: 'Daily Fleet Summary', frequency: 'Daily', recipients: 'dispatch@carrier.com', nextRun: 'Tomorrow 7:00 AM', status: 'active' },
                      { name: 'Weekly Safety Report', frequency: 'Weekly', recipients: 'safety@carrier.com', nextRun: 'Monday 8:00 AM', status: 'active' },
                      { name: 'Monthly Fuel Analysis', frequency: 'Monthly', recipients: 'ops@carrier.com', nextRun: 'Jul 1, 2025', status: 'paused' }
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
                      setSelectedMetrics(['utilization', 'revenue', 'miles']);
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