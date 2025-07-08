import { useState, useEffect, useCallback } from 'react';

export interface CarrierSearchParams {
  loadId: string;
  origin: string;
  destination: string;
  equipmentType: string;
  minRate: number;
  pickupDate: string;
  weight?: number;
  commodity?: string;
}

export interface MatchedCarrier {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  mcNumber: string;
  dotNumber: string;
  rating: number;
  insuranceCoverage: number;
  insuranceExpiry: string;
  equipmentTypes: string[];
  lanes: string[];
  matchScore: number;
  availability: 'available' | 'busy' | 'offline';
  lastActive: string;
  totalLoads: number;
  onTimePercentage: number;
  notes?: string;
}

interface UseCarrierMatcherResult {
  isSearching: boolean;
  searchStarted: boolean;
  matchedCarriers: MatchedCarrier[];
  searchProgress: number;
  searchMessage: string;
  searchCarriers: (params: CarrierSearchParams) => void;
  clearMatches: () => void;
  contactedCarriers: Set<string>;
  markCarrierContacted: (carrierId: string) => void;
  savedCarriers: Set<string>;
  toggleSaveCarrier: (carrierId: string) => void;
}

const searchMessages = [
  'Searching carrier database...',
  'Analyzing equipment compatibility...',
  'Checking lane preferences...',
  'Verifying insurance status...',
  'Calculating match scores...',
  'Finding smart matches...',
  'Finalizing recommendations...'
];

export const useCarrierMatcher = (): UseCarrierMatcherResult => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const [matchedCarriers, setMatchedCarriers] = useState<MatchedCarrier[]>([]);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchMessage, setSearchMessage] = useState('');
  const [contactedCarriers, setContactedCarriers] = useState<Set<string>>(new Set());
  const [savedCarriers, setSavedCarriers] = useState<Set<string>>(new Set());

  // Simulate search progress
  useEffect(() => {
    if (!searchStarted) return;

    let progress = 0;
    let messageIndex = 0;
    
    const progressInterval = setInterval(() => {
      progress += 10;
      setSearchProgress(progress);
      
      // Update message every ~1.5 seconds
      if (progress % 15 === 0 && messageIndex < searchMessages.length) {
        setSearchMessage(searchMessages[messageIndex]);
        messageIndex++;
      }
      
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [searchStarted]);

  const searchCarriers = useCallback((params: CarrierSearchParams) => {
    setIsSearching(true);
    setSearchStarted(true);
    setSearchProgress(0);
    setSearchMessage(searchMessages[0]);
    setMatchedCarriers([]);

    // Simulate API call and matching logic
    setTimeout(() => {
      // Generate mock matched carriers based on search params
      const mockMatches: MatchedCarrier[] = [
        {
          id: '1',
          name: 'John Smith',
          company: 'Swift Transportation',
          phone: '+1 (555) 123-4567',
          email: 'john.smith@swifttrans.com',
          mcNumber: 'MC123456',
          dotNumber: 'DOT789012',
          rating: 4.8,
          insuranceCoverage: 1000000,
          insuranceExpiry: '2025-12-31',
          equipmentTypes: ['Dry Van', 'Reefer'],
          lanes: [`${params.origin} - ${params.destination}`, 'Chicago - New York'],
          matchScore: 95,
          availability: 'available',
          lastActive: '5 minutes ago',
          totalLoads: 342,
          onTimePercentage: 98.5,
          notes: 'Preferred carrier for this lane'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          company: 'Prime Logistics',
          phone: '+1 (555) 234-5678',
          email: 'maria@primelogistics.com',
          mcNumber: 'MC234567',
          dotNumber: 'DOT890123',
          rating: 4.6,
          insuranceCoverage: 750000,
          insuranceExpiry: '2025-10-15',
          equipmentTypes: ['Dry Van', 'Flatbed'],
          lanes: [`${params.origin} - ${params.destination}`],
          matchScore: 88,
          availability: 'available',
          lastActive: '1 hour ago',
          totalLoads: 256,
          onTimePercentage: 96.2
        },
        {
          id: '3',
          name: 'Mike Johnson',
          company: 'Express Carriers LLC',
          phone: '+1 (555) 345-6789',
          email: 'mike.j@expresscarriers.com',
          mcNumber: 'MC345678',
          dotNumber: 'DOT901234',
          rating: 4.5,
          insuranceCoverage: 500000,
          insuranceExpiry: '2025-08-20',
          equipmentTypes: ['Dry Van'],
          lanes: ['National Coverage'],
          matchScore: 82,
          availability: 'busy',
          lastActive: '30 minutes ago',
          totalLoads: 189,
          onTimePercentage: 94.8,
          notes: 'Currently on a load, available tomorrow'
        }
      ];

      setMatchedCarriers(mockMatches);
      setIsSearching(false);
    }, 10000); // 10 second delay as specified
  }, []);

  const clearMatches = useCallback(() => {
    setMatchedCarriers([]);
    setSearchStarted(false);
    setSearchProgress(0);
    setSearchMessage('');
  }, []);

  const markCarrierContacted = useCallback((carrierId: string) => {
    setContactedCarriers(prev => new Set(prev).add(carrierId));
  }, []);

  const toggleSaveCarrier = useCallback((carrierId: string) => {
    setSavedCarriers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(carrierId)) {
        newSet.delete(carrierId);
      } else {
        newSet.add(carrierId);
      }
      return newSet;
    });
  }, []);

  return {
    isSearching,
    searchStarted,
    matchedCarriers,
    searchProgress,
    searchMessage,
    searchCarriers,
    clearMatches,
    contactedCarriers,
    markCarrierContacted,
    savedCarriers,
    toggleSaveCarrier
  };
};