import { useState, useEffect, useCallback } from 'react';
import { brokerApi, Load } from '../api/brokerApi';

type LoadStatus = 'draft' | 'posted' | 'assigned' | 'en_route' | 'delivered' | 'awaiting_docs' | 'paid' | 'all';

interface UseLoadsListResult {
  loads: Load[];
  filteredLoads: Load[];
  activeTab: LoadStatus;
  setActiveTab: (tab: LoadStatus) => void;
  isLoading: boolean;
  error: Error | null;
  refreshLoads: () => Promise<void>;
}

export const useLoadsList = (): UseLoadsListResult => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [activeTab, setActiveTab] = useState<LoadStatus>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLoads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadsData = await brokerApi.getLoads();
      setLoads(loadsData);
      
      // Apply initial filtering
      if (activeTab === 'all') {
        setFilteredLoads(loadsData);
      } else {
        setFilteredLoads(loadsData.filter(load => load.status === activeTab));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // Fetch loads on component mount and when activeTab changes
  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  // Filter loads when activeTab or loads change
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredLoads(loads);
    } else {
      setFilteredLoads(loads.filter(load => load.status === activeTab));
    }
  }, [activeTab, loads]);

  return {
    loads,
    filteredLoads,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    refreshLoads: fetchLoads
  };
};

export default useLoadsList;