// Team Workload Mock Data

export interface TeamWorkload {
  member: string;
  role: string;
  activeLoads: number;
  pendingTasks: number;
  lastActive: string;
  utilization: number;
}

export const generateTeamWorkload = (activePeriod: string): TeamWorkload[] => {
  return [
    {
      member: 'Sarah Operator',
      role: 'Operator',
      activeLoads: 12 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 4 : 15),
      pendingTasks: 5 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 3 : 10),
      lastActive: '2 min ago',
      utilization: Math.min(99, 85 + (activePeriod === 'month' ? 5 : activePeriod === 'week' ? 2 : 0))
    },
    {
      member: 'John Dispatcher',
      role: 'Dispatcher',
      activeLoads: 18 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 4 : 15),
      pendingTasks: 3 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 3 : 10),
      lastActive: 'Just now',
      utilization: Math.min(99, 92 + (activePeriod === 'month' ? 3 : activePeriod === 'week' ? 1 : 0))
    },
    {
      member: 'Robert Manager',
      role: 'Customer Manager',
      activeLoads: 7 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 4 : 15),
      pendingTasks: 9 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 3 : 10),
      lastActive: '15 min ago',
      utilization: Math.min(99, 76 + (activePeriod === 'month' ? 8 : activePeriod === 'week' ? 4 : 0))
    },
    {
      member: 'Lisa Coordinator',
      role: 'Operations Coordinator',
      activeLoads: 15 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 4 : 15),
      pendingTasks: 2 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 3 : 10),
      lastActive: '5 min ago',
      utilization: Math.min(99, 88 + (activePeriod === 'month' ? 4 : activePeriod === 'week' ? 2 : 0))
    },
    {
      member: 'Carlos Planner',
      role: 'Load Planner',
      activeLoads: 9 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 4 : 15),
      pendingTasks: 7 * (activePeriod === 'day' ? 1 : activePeriod === 'week' ? 3 : 10),
      lastActive: '30 min ago',
      utilization: Math.min(99, 65 + (activePeriod === 'month' ? 10 : activePeriod === 'week' ? 5 : 0))
    }
  ];
};