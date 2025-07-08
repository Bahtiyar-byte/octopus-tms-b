import { useState, useEffect } from 'react';
import { brokerApi, Contract } from '../api/brokerApi';

interface UseContractsResult {
  contracts: Contract[];
  isLoading: boolean;
  error: Error | null;
  refreshContracts: () => Promise<void>;
  uploadContract: (file: File, carrierId: string, carrierName: string) => Promise<void>;
}

export const useContracts = (): UseContractsResult => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contractsData = await brokerApi.getContracts();
      setContracts(contractsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch contracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []);

  // Mock function to simulate uploading a contract
  const uploadContract = async (file: File, carrierId: string, carrierName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would upload the file to a server
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new contract object
      const newContract: Contract = {
        id: `CT${Math.floor(1000 + Math.random() * 9000)}`,
        carrierId,
        carrierName,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        documentUrl: `/documents/contracts/${file.name}`
      };
      
      // Add the new contract to the list
      setContracts(prevContracts => [...prevContracts, newContract]);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload contract'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contracts,
    isLoading,
    error,
    refreshContracts: fetchContracts,
    uploadContract
  };
};

export default useContracts;