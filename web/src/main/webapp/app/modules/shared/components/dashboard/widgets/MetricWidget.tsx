import React from 'react';
import { formatCurrency, formatNumber } from '../../../../../utils/format';
import { useAuth } from '../../../../../context/AuthContext';

interface MetricWidgetProps {
  id: string;
  type: string;
  title: string;
  props?: Record<string, string | number | undefined>;
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({ id, type, title, props = {} }) => {
  const { user } = useAuth();
  const role = user?.role;
  
  // Get metric data based on widget type and role
  const metricData = getMetricData(type, role);
  
  const { value, subtitle, progress, icon, gradient } = { ...metricData, ...props };
  
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
          {getIcon(icon || type)}
        </div>
      </div>
      <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-2">{formatValue(value, type)}</p>
      {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

interface MetricData {
  value: number;
  subtitle?: string;
  progress?: number;
  gradient: string;
  icon?: string;
}

function getMetricData(type: string, role?: string): MetricData {
  // Mock data - in real app, this would fetch from API
  const metricsMap: Record<string, MetricData> = {
    revenue: {
      value: 45890,
      subtitle: '+12% from last month',
      progress: 83,
      gradient: 'from-purple-500 to-purple-600',
      icon: 'dollar'
    },
    activeLoads: {
      value: 24,
      subtitle: '5 awaiting assignment',
      progress: 75,
      gradient: 'from-blue-500 to-blue-600',
      icon: 'package'
    },
    carriers: {
      value: 45,
      subtitle: '12 preferred partners',
      progress: 92,
      gradient: 'from-orange-500 to-orange-600',
      icon: 'users'
    },
    drivers: {
      value: 32,
      subtitle: '28 on duty',
      progress: 87,
      gradient: 'from-green-500 to-green-600',
      icon: 'user'
    },
    equipment: {
      value: 58,
      subtitle: '52 available',
      progress: 90,
      gradient: 'from-indigo-500 to-indigo-600',
      icon: 'truck'
    },
    inventory: {
      value: 1250,
      subtitle: 'Units in stock',
      progress: 68,
      gradient: 'from-teal-500 to-teal-600',
      icon: 'box'
    },
    shipments: {
      value: 15,
      subtitle: 'Pending pickup',
      progress: 45,
      gradient: 'from-pink-500 to-pink-600',
      icon: 'send'
    }
  };
  
  return metricsMap[type] || {
    value: 0,
    gradient: 'from-gray-500 to-gray-600'
  };
}

function formatValue(value: string | number | undefined, type: string): string {
  if (value === undefined) return '0';
  
  if (type === 'revenue' || type.includes('cost') || type.includes('payment')) {
    return formatCurrency(Number(value));
  }
  if (typeof value === 'number') {
    return formatNumber(value);
  }
  return String(value);
}

function getIcon(iconName: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    dollar: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    package: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    users: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    user: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    truck: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    box: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    send: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    activity: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  };
  
  return icons[iconName] || icons.package;
}