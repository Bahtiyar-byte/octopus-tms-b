import React, { useState } from 'react';
import { Card } from '../../../../components';
import { useRoleConfig } from '../../hooks/useRoleConfig';
import { useAuth } from '../../../../context/AuthContext';
import { ReportsDashboard } from '../../components/reports/ReportsDashboard';
import { ReportGenerator } from '../../components/reports/ReportGenerator';
import { GeneratedReportsList } from '../../components/reports/GeneratedReportsList';
import { toast } from 'react-hot-toast';

export type ReportType = string;
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
  const config = useRoleConfig('reports');
  const { user } = useAuth();
  const role = user?.role;
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'generate' | 'history'>('dashboard');
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('');
  const [dateRange, setDateRange] = useState<DateRangeType>('last30days');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  
  // Get report types from config
  const reportTypes = config.filters?.find(f => f.key === 'type')?.options || [];
  
  // Role-based report templates
  const getReportTemplates = (): ReportTemplate[] => {
    const baseTemplates: Record<string, ReportTemplate[]> = {
      BROKER: [
        { id: '1', name: 'Revenue Analysis', description: 'Track revenue trends and growth metrics', type: 'revenue', icon: 'dollar', color: 'green', isPopular: true },
        { id: '2', name: 'Carrier Performance', description: 'Monitor carrier performance and ratings', type: 'carrier_performance', icon: 'truck', color: 'blue', isPopular: true },
        { id: '3', name: 'Customer Analysis', description: 'Evaluate customer relationships and revenue', type: 'customer_analysis', icon: 'users', color: 'purple' },
        { id: '4', name: 'Load Summary', description: 'Comprehensive load analytics and trends', type: 'load_summary', icon: 'package', color: 'indigo' },
      ],
      SHIPPER: [
        { id: '1', name: 'Inventory Report', description: 'Track inventory levels and movements', type: 'inventory', icon: 'box', color: 'teal', isPopular: true },
        { id: '2', name: 'Shipment History', description: 'Analyze shipment patterns and performance', type: 'shipment_history', icon: 'history', color: 'blue', isPopular: true },
        { id: '3', name: 'Warehouse Utilization', description: 'Monitor warehouse capacity and efficiency', type: 'warehouse_utilization', icon: 'warehouse', color: 'orange' },
        { id: '4', name: 'Cost Analysis', description: 'Shipping costs and optimization opportunities', type: 'cost_analysis', icon: 'chart', color: 'red' },
      ],
      CARRIER: [
        { id: '1', name: 'Driver Logs', description: 'Hours of service and compliance reports', type: 'driver_logs', icon: 'user', color: 'blue', isPopular: true },
        { id: '2', name: 'Equipment Maintenance', description: 'Vehicle maintenance schedules and history', type: 'equipment_maintenance', icon: 'wrench', color: 'yellow' },
        { id: '3', name: 'Fuel Efficiency', description: 'Fuel consumption and efficiency metrics', type: 'fuel_efficiency', icon: 'gas', color: 'green', isPopular: true },
        { id: '4', name: 'Revenue per Mile', description: 'Profitability analysis by route and load', type: 'revenue_miles', icon: 'dollar', color: 'purple' },
      ]
    };
    
    return baseTemplates[role || 'BROKER'] || [];
  };
  
  const handleGenerateReport = async (reportData: any) => {
    try {
      // Simulate report generation
      toast.loading('Generating report...');
      
      // In real app, would call API
      setTimeout(() => {
        const newReport: GeneratedReport = {
          id: Date.now().toString(),
          name: reportData.name || `${reportData.type} Report`,
          type: reportData.type,
          dateRange: reportData.dateRange,
          metrics: reportData.metrics || [],
          createdAt: new Date().toLocaleString(),
          fileSize: '2.1 MB',
          status: 'completed'
        };
        
        setGeneratedReports([newReport, ...generatedReports]);
        toast.success('Report generated successfully!');
        setActiveTab('history');
      }, 2000);
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };
  
  const handleDownloadReport = (report: GeneratedReport, format: ExportFormat) => {
    toast.success(`Downloading ${report.name}.${format}`);
    // In real app, would trigger download
  };
  
  const handleScheduleReport = (scheduleData: any) => {
    toast.success('Report scheduled successfully');
    // In real app, would save schedule
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{config.title || 'Reports'}</h1>
        <p className="text-gray-600">Generate and analyze business reports</p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generate'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generate Report
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Report History
            {generatedReports.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                {generatedReports.length}
              </span>
            )}
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <ReportsDashboard
          templates={getReportTemplates()}
          onSelectTemplate={(template) => {
            setSelectedReportType(template.type);
            setActiveTab('generate');
          }}
          role={role || 'BROKER'}
        />
      )}
      
      {activeTab === 'generate' && (
        <ReportGenerator
          reportTypes={reportTypes}
          selectedType={selectedReportType}
          dateRange={dateRange}
          config={config}
          onGenerate={handleGenerateReport}
          onSchedule={handleScheduleReport}
        />
      )}
      
      {activeTab === 'history' && (
        <GeneratedReportsList
          reports={generatedReports}
          onDownload={handleDownloadReport}
          onDelete={(id) => {
            setGeneratedReports(generatedReports.filter(r => r.id !== id));
            toast.success('Report deleted');
          }}
        />
      )}
    </div>
  );
};

export default Reports;