import React from 'react';
import { WidgetConfig } from '../../config/roleConfig';
import { MetricWidget } from './widgets/MetricWidget';
import { ChartWidget } from './widgets/ChartWidget';
import { ActivityWidget } from './widgets/ActivityWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { TableWidget } from './widgets/TableWidget';

interface DashboardWidgetProps {
  config: WidgetConfig;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ config }) => {
  // Map widget types to components
  const widgetComponents: Record<string, React.FC<any>> = {
    revenue: MetricWidget,
    activeLoads: MetricWidget,
    carriers: MetricWidget,
    drivers: MetricWidget,
    equipment: MetricWidget,
    inventory: MetricWidget,
    shipments: MetricWidget,
    warehouses: TableWidget,
    availableLoads: TableWidget,
    weather: WeatherWidget,
    activity: ActivityWidget,
    chart: ChartWidget,
  };

  const WidgetComponent = widgetComponents[config.type] || MetricWidget;
  
  return (
    <div className={getWidgetSizeClass(config.size)}>
      <WidgetComponent {...config} />
    </div>
  );
};

function getWidgetSizeClass(size?: 'small' | 'medium' | 'large' | 'full'): string {
  switch (size) {
    case 'small':
      return 'col-span-1';
    case 'medium':
      return 'col-span-1 lg:col-span-2';
    case 'large':
      return 'col-span-1 lg:col-span-3';
    case 'full':
      return 'col-span-1 lg:col-span-4';
    default:
      return 'col-span-1';
  }
}