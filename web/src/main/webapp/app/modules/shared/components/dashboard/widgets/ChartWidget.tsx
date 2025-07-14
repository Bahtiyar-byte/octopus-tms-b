import React from 'react';

interface ChartWidgetProps {
  id: string;
  title: string;
  type: string;
  size?: string;
  props?: Record<string, any>;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ title, props = {} }) => {
  // Placeholder for chart component
  // In real app, would use recharts or similar library
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500">Chart visualization would go here</p>
      </div>
    </div>
  );
};