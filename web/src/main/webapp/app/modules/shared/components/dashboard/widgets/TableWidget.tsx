import React from 'react';
import { formatCurrency, formatDate } from '../../../../../utils/format';
import { getLoadStatusColor, formatLoadStatus } from '../../../../../utils/load/loadUtils';

interface TableWidgetProps {
  id: string;
  title: string;
  type: string;
  size?: string;
  props?: Record<string, string | number | boolean>;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ title, type }) => {
  // Mock data based on widget type
  const tableData = getTableData(type);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {tableData.headers.map((header, index) => (
                <th key={index} className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-3 px-4 text-sm">
                    {renderCell(cell, tableData.headers[cellIndex])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function getTableData(type: string) {
  switch (type) {
    case 'warehouses':
      return {
        headers: ['Warehouse', 'Location', 'Capacity', 'Utilization'],
        rows: [
          ['Main Distribution Center', 'Chicago, IL', '10,000 sq ft', '78%'],
          ['East Coast Hub', 'Newark, NJ', '8,500 sq ft', '65%'],
          ['West Coast Facility', 'Los Angeles, CA', '12,000 sq ft', '82%'],
        ]
      };
    case 'availableLoads':
      return {
        headers: ['Load ID', 'Origin', 'Destination', 'Rate', 'Status'],
        rows: [
          ['LD-000124', 'Chicago, IL', 'Atlanta, GA', '$2,450', 'available'],
          ['LD-000125', 'Dallas, TX', 'Phoenix, AZ', '$1,890', 'available'],
          ['LD-000126', 'Miami, FL', 'Charlotte, NC', '$2,150', 'assigned'],
        ]
      };
    default:
      return {
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [['Data 1', 'Data 2', 'Data 3']]
      };
  }
}

function renderCell(cell: string | number, header: string): React.ReactNode {
  if (header.toLowerCase() === 'status') {
    const colorClass = getLoadStatusColor(String(cell));
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {formatLoadStatus(String(cell))}
      </span>
    );
  }
  
  if (header.toLowerCase().includes('rate') || header.toLowerCase().includes('revenue')) {
    return <span className="font-medium text-gray-900">{cell}</span>;
  }
  
  return <span className="text-gray-600">{cell}</span>;
}