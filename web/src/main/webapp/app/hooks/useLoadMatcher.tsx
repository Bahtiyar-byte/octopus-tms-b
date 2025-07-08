import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface SearchParams {
  origin: string;
  destination: string;
  equipment: string;
  minRate: number;
  date: string;
}

interface BrokerInfo {
  name: string;
  company: string;
  phone: string;
  email: string;
  rating?: number;
}

interface LoadMatch {
  id: string;
  origin: string;
  destination: string;
  equipment: string;
  rate: number;
  weight: string;
  distance: number;
  pickupDate: string;
  deliveryDate: string;
  broker: BrokerInfo;
  isHotLoad?: boolean;
  matchScore?: number;
}

// Mock brokers database
const mockBrokers: BrokerInfo[] = [
  { name: "John Smith", company: "ABC Logistics", phone: "+1 (555) 123-4567", email: "john@abclogistics.com", rating: 4.5 },
  { name: "Sarah Johnson", company: "Prime Freight", phone: "+1 (555) 234-5678", email: "sarah@primefreight.com", rating: 4.8 },
  { name: "Mike Davis", company: "Express Transport", phone: "+1 (555) 345-6789", email: "mike@expresstransport.com", rating: 4.2 },
  { name: "Emily Chen", company: "Global Shipping Co", phone: "+1 (555) 456-7890", email: "emily@globalshipping.com", rating: 4.7 },
  { name: "Robert Wilson", company: "Fast Lane Logistics", phone: "+1 (555) 567-8901", email: "robert@fastlane.com", rating: 4.6 }
];

export const useLoadMatcher = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchedLoads, setMatchedLoads] = useState<LoadMatch[]>([]);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<LoadMatch | null>(null);

  const generateMockLoads = (params: SearchParams): LoadMatch[] => {
    const baseRate = params.minRate || 2000;
    const loads: LoadMatch[] = [];
    
    // Generate 1-3 matching loads
    const numLoads = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numLoads; i++) {
      const rateVariation = Math.random() * 500 + 200;
      const distanceVariation = Math.random() * 200 + 50;
      const broker = mockBrokers[Math.floor(Math.random() * mockBrokers.length)];
      
      loads.push({
        id: `LOAD-${Math.floor(Math.random() * 10000)}`,
        origin: params.origin,
        destination: params.destination,
        equipment: params.equipment,
        rate: Math.round(baseRate + rateVariation),
        weight: `${Math.floor(Math.random() * 10000 + 35000)} lbs`,
        distance: Math.round(500 + distanceVariation),
        pickupDate: params.date,
        deliveryDate: new Date(new Date(params.date).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        broker: broker,
        isHotLoad: Math.random() > 0.7,
        matchScore: Math.floor(Math.random() * 15 + 85)
      });
    }
    
    return loads.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };

  const startSearch = useCallback((params: SearchParams) => {
    setIsSearching(true);
    setMatchedLoads([]);
    
    // Simulate search completion after 10 seconds
    setTimeout(() => {
      const loads = generateMockLoads(params);
      setMatchedLoads(loads);
      setIsSearching(false);
      
      if (loads.length > 0) {
        // Show notification
        toast.success(
          <div className="flex items-center">
            <span className="mr-2">🎯</span>
            <div>
              <p className="font-semibold">Smart Match Found!</p>
              <p className="text-sm">{loads.length} load{loads.length > 1 ? 's' : ''} available from {params.origin} to {params.destination}</p>
            </div>
          </div>,
          {
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#10B981',
              color: 'white',
            }
          }
        );
        
        // Play notification sound (optional)
        // const audio = new Audio('/notification.mp3');
        // audio.play().catch(() => {});
        
        // Automatically open modal
        setShowLoadModal(true);
      } else {
        toast.error('No matching loads found. Try adjusting your search criteria.');
      }
    }, 10000);
  }, []);

  const handleCallBroker = useCallback((load: LoadMatch) => {
    setSelectedLoad(load);
    setShowLoadModal(false);
    setShowCallModal(true);
  }, []);

  const handleEmailBroker = useCallback((load: LoadMatch) => {
    // Simulate email being sent
    toast.success(`Email sent to ${load.broker.name} at ${load.broker.email}`);
    // In a real app, this would open an email client or send via API
    window.location.href = `mailto:${load.broker.email}?subject=Load Inquiry - ${load.id}&body=Hi ${load.broker.name},%0D%0A%0D%0AI'm interested in the load from ${load.origin} to ${load.destination}.%0D%0A%0D%0ALoad ID: ${load.id}%0D%0ARate: $${load.rate}%0D%0AEquipment: ${load.equipment}%0D%0A%0D%0APlease let me know if this load is still available.%0D%0A%0D%0AThank you!`;
  }, []);

  const handleRejectLoad = useCallback((loadId: string) => {
    setMatchedLoads(prev => prev.filter(load => load.id !== loadId));
    toast('Load rejected. Showing next match...', { icon: 'ℹ️' });
    
    if (matchedLoads.length <= 1) {
      setShowLoadModal(false);
    }
  }, [matchedLoads]);

  const handleSaveForLater = useCallback((loadId: string) => {
    toast.success('Load saved for later review');
    // In a real app, this would save to backend
    const load = matchedLoads.find(l => l.id === loadId);
    if (load) {
      const savedLoads = JSON.parse(localStorage.getItem('savedLoads') || '[]');
      savedLoads.push({ ...load, savedAt: new Date().toISOString() });
      localStorage.setItem('savedLoads', JSON.stringify(savedLoads));
    }
    setShowLoadModal(false);
  }, [matchedLoads]);

  const handleSaveCallNotes = useCallback((notes: string, contacted: boolean) => {
    if (selectedLoad) {
      toast.success(
        <div>
          <p className="font-semibold">Call completed!</p>
          <p className="text-sm">Notes saved for load {selectedLoad.id}</p>
        </div>
      );
      
      // In a real app, save to backend
      const callRecord = {
        loadId: selectedLoad.id,
        broker: selectedLoad.broker,
        notes,
        contacted,
        timestamp: new Date().toISOString()
      };
      
      const callHistory = JSON.parse(localStorage.getItem('callHistory') || '[]');
      callHistory.push(callRecord);
      localStorage.setItem('callHistory', JSON.stringify(callHistory));
      
      // Optionally create a follow-up reminder
      if (contacted) {
        setTimeout(() => {
          toast(
            <div>
              <p className="font-semibold">Create follow-up?</p>
              <p className="text-sm">Schedule a reminder to follow up with {selectedLoad.broker.name}</p>
              <div className="mt-2 flex space-x-2">
                <button 
                  onClick={() => {
                    toast.success('Follow-up reminder set for tomorrow');
                    toast.dismiss();
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Yes
                </button>
                <button 
                  onClick={() => toast.dismiss()}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                >
                  No
                </button>
              </div>
            </div>,
            {
              duration: 10000,
              position: 'bottom-right'
            }
          );
        }, 1000);
      }
    }
    
    setShowCallModal(false);
    setSelectedLoad(null);
  }, [selectedLoad]);

  return {
    isSearching,
    matchedLoads,
    showLoadModal,
    showCallModal,
    selectedLoad,
    startSearch,
    setShowLoadModal,
    setShowCallModal,
    handleCallBroker,
    handleEmailBroker,
    handleRejectLoad,
    handleSaveForLater,
    handleSaveCallNotes
  };
};

export default useLoadMatcher;