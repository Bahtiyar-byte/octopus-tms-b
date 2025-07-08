// KPI Mock Data for Supervisor Dashboard

export interface SupervisorKPI {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

export const generateKPIs = (activePeriod: string): SupervisorKPI[] => {
  const periodLabel = activePeriod === 'day' ? 'Today' : 
                     activePeriod === 'week' ? 'This Week' : 'This Month';
  const changeMultiplier = activePeriod === 'day' ? 1 : activePeriod === 'week' ? 0.8 : 0.6;

  return [
    {
      title: `On-Time Delivery Rate (${periodLabel})`,
      value: `${Math.min(99, 92 + (activePeriod === 'month' ? 3 : activePeriod === 'week' ? 1 : 0))}%`,
      change: 2.5 * changeMultiplier,
      icon: 'fas fa-clock',
      color: 'blue'
    },
    {
      title: `Team Efficiency (${periodLabel})`,
      value: `${Math.min(99, 87 + (activePeriod === 'month' ? 4 : activePeriod === 'week' ? 2 : 0))}%`,
      change: 3.2 * changeMultiplier,
      icon: 'fas fa-bolt',
      color: 'green'
    },
    {
      title: `Customer Satisfaction (${periodLabel})`,
      value: `${4.7 + (activePeriod === 'month' ? 0.2 : activePeriod === 'week' ? 0.1 : 0)}/5`,
      change: -0.1 * changeMultiplier,
      icon: 'fas fa-smile',
      color: 'orange'
    },
    {
      title: `Utilization Rate (${periodLabel})`,
      value: `${Math.min(99, 94 + (activePeriod === 'month' ? 2 : activePeriod === 'week' ? 1 : 0))}%`,
      change: 1.8 * changeMultiplier,
      icon: 'fas fa-chart-line',
      color: 'purple'
    },
    {
      title: `Active Incidents (${periodLabel})`,
      value: 3 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 5 : 20),
      change: -2 * changeMultiplier,
      icon: 'fas fa-exclamation-triangle',
      color: 'red'
    },
    {
      title: `Revenue per Mile (${periodLabel})`,
      value: `$${(2.34 + (activePeriod === 'month' ? 0.11 : activePeriod === 'week' ? 0.05 : 0)).toFixed(2)}`,
      change: 0.12 * changeMultiplier,
      icon: 'fas fa-dollar-sign',
      color: 'teal'
    }
  ];
};