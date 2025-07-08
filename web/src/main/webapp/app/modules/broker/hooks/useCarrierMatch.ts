import { useState, useEffect } from 'react';
import { brokerApi, Carrier, Load } from '../api/brokerApi';

interface UseCarrierMatchResult {
  carriers: Carrier[];
  selectedLoad: Load | null;
  setSelectedLoadId: (loadId: string | null) => void;
  isLoading: boolean;
  error: Error | null;
  refreshCarriers: () => Promise<void>;
  sendInvite: (carrierId: string) => Promise<void>;
  inviteSent: Record<string, boolean>;
}

export const useCarrierMatch = (): UseCarrierMatchResult => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [inviteSent, setInviteSent] = useState<Record<string, boolean>>({});

  // Fetch carriers
  const fetchCarriers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const carriersData = await brokerApi.getAvailableCarriers();
      setCarriers(carriersData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch load details if a load ID is selected
  useEffect(() => {
    const fetchLoadDetails = async () => {
      if (!selectedLoadId) {
        setSelectedLoad(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const loadData = await brokerApi.getLoad(selectedLoadId);
        setSelectedLoad(loadData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load load details'));
        setSelectedLoad(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoadDetails();
  }, [selectedLoadId]);

  // Fetch carriers on component mount
  useEffect(() => {
    fetchCarriers();
  }, []);

  // Send invite to carrier
  const sendInvite = async (carrierId: string) => {
    setError(null);
    
    try {
      // In a real app, this would call an API to send an invite
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mark this carrier as invited
      setInviteSent(prev => ({
        ...prev,
        [carrierId]: true
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send invite'));
    }
  };

  return {
    carriers,
    selectedLoad,
    setSelectedLoadId,
    isLoading,
    error,
    refreshCarriers: fetchCarriers,
    sendInvite,
    inviteSent
  };
};

export default useCarrierMatch;