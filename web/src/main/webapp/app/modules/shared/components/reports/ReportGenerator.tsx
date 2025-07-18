import React, { useState } from 'react';
import { Card } from '../../../../components';
import { DateRangeType } from '../../pages/Reports/Reports';
import { PageConfig } from '../../config/roleConfig';

interface ReportGeneratorProps {
  reportTypes: any[];
  selectedType: string;
  dateRange: DateRangeType;
  config: PageConfig;
  onGenerate: (reportData: any) => void;
  onSchedule: (scheduleData: any) => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  reportTypes,
  selectedType,
  dateRange,
  config,
  onGenerate,
  onSchedule
}) => {
  const [reportName, setReportName] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  const handleGenerate = () => {
    onGenerate({
      name: reportName || `${selectedType} Report`,
      type: selectedType,
      dateRange: dateRange,
      metrics: selectedMetrics,
      format: exportFormat
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Name
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter report name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedType}
            >
              <option value="">Select a report type</option>
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={dateRange}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="mr-2"
                />
                PDF
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="mr-2"
                />
                Excel
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="mr-2"
                />
                CSV
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleGenerate}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate Report
            </button>
            <button
              onClick={() => onSchedule({ type: selectedType, dateRange })}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Schedule Report
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};