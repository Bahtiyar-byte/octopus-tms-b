import { useState, useEffect } from 'react';
import { brokerApi, BrokerMetrics, Load } from '../api/brokerApi';

interface UseBrokerDashboardResult {
  metrics: BrokerMetrics | null;
  recentLoads: Load[];
  loadsByStatus: {
    [key: string]: number;
  };
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

export const useBrokerDashboard = (): UseBrokerDashboardResult => {
  const [metrics, setMetrics] = useState<BrokerMetrics | null>(null);
  const [recentLoads, setRecentLoads] = useState<Load[]>([]);
  const [loadsByStatus, setLoadsByStatus] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch metrics
      const metricsData = await brokerApi.getDashboardMetrics();
      setMetrics(metricsData);
      
      // Fetch recent loads
      const loadsData = await brokerApi.getLoads();
      
      // Sort by most recent first
      const sortedLoads = [...loadsData].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      setRecentLoads(sortedLoads.slice(0, 5)); // Get 5 most recent loads
      
      // Calculate loads by status
      const statusCounts: { [key: string]: number } = {};
      loadsData.forEach(load => {
        statusCounts[load.status] = (statusCounts[load.status] || 0) + 1;
      });
      
      setLoadsByStatus(statusCounts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    metrics,
    recentLoads,
    loadsByStatus,
    isLoading,
    error,
    refreshData: fetchDashboardData
  };
};

export default useBrokerDashboard;