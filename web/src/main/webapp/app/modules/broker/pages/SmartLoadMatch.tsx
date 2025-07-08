import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchLoader } from '../components/SearchLoader';
import { CarrierMatchModal } from '../components/CarrierMatchModal';
import { CarrierCallModal } from '../components/CarrierCallModal';
import { useCarrierMatcher, CarrierSearchParams, MatchedCarrier } from '../hooks/useCarrierMatcher';
import { 
  Search, 
  MapPin, 
  Truck, 
  Calendar, 
  DollarSign, 
  Package,
  Bell,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const SmartLoadMatch: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useCarrierMatcher();

  const [searchParams, setSearchParams] = useState<CarrierSearchParams>({
    loadId: 'LD-2024-001',
    origin: 'Chicago, IL',
    destination: 'New York, NY',
    equipmentType: 'Dry Van',
    minRate: 2500,
    pickupDate: new Date().toISOString().split('T')[0],
    weight: 35000,
    commodity: 'General Freight'
  });

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<MatchedCarrier | null>(null);
  const [hasNotified, setHasNotified] = useState(false);

  // Show notification and modal when search completes
  useEffect(() => {
    if (searchStarted && !isSearching && matchedCarriers.length > 0 && !hasNotified) {
      // Play notification sound
      playNotificationSound();
      
      // Show toast notification
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Smart Match Found!
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {matchedCarriers.length} carrier{matchedCarriers.length !== 1 ? 's' : ''} matched for your load from {searchParams.origin} to {searchParams.destination}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setShowMatchModal(true);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              View
            </button>
          </div>
        </div>
      ), {
        duration: 6000,
        position: 'top-right',
      });

      // Auto-open modal after 1 second
      setTimeout(() => {
        setShowMatchModal(true);
      }, 1000);

      setHasNotified(true);
    }
  }, [searchStarted, isSearching, matchedCarriers, hasNotified, searchParams]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a pleasant notification sound
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handleSearch = () => {
    setHasNotified(false);
    clearMatches();
    searchCarriers(searchParams);
  };

  const handleCallCarrier = (carrier: MatchedCarrier) => {
    setSelectedCarrier(carrier);
    setShowCallModal(true);
    setShowMatchModal(false);
  };

  const handleEmailCarrier = (carrier: MatchedCarrier) => {
    // Mock email action
    toast.success(`Email draft opened for ${carrier.name} at ${carrier.email}`);
    markCarrierContacted(carrier.id);
  };

  const handleSaveCall = (carrierId: string, notes: string, duration: number) => {
    markCarrierContacted(carrierId);
    toast.success(`Call notes saved (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`);
  };

  const equipmentTypes = ['Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'RGN'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/broker/loads')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Loads
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Load Match</h1>
                <p className="text-sm text-gray-500">AI-powered carrier matching for your loads</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Load #{searchParams.loadId}</span>
          </div>
        </div>
      </div>

      {/* Search Form */}
      {!isSearching && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Find the Perfect Carrier</h2>
              <p className="text-sm text-gray-500">Enter your load details to match with qualified carriers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Origin
                </label>
                <input
                  type="text"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Destination
                </label>
                <input
                  type="text"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>

              {/* Equipment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Truck className="w-4 h-4 inline mr-1" />
                  Equipment Type
                </label>
                <select
                  value={searchParams.equipmentType}
                  onChange={(e) => setSearchParams({ ...searchParams, equipmentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={searchParams.pickupDate}
                  onChange={(e) => setSearchParams({ ...searchParams, pickupDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Rate
                </label>
                <input
                  type="number"
                  value={searchParams.minRate}
                  onChange={(e) => setSearchParams({ ...searchParams, minRate: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter rate"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={searchParams.weight}
                  onChange={(e) => setSearchParams({ ...searchParams, weight: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter weight"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <details className="cursor-pointer">
                <summary className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                </summary>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Verified Carriers Only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">4+ Star Rating</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">95%+ On-Time</span>
                  </label>
                </div>
              </details>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              <Search className="w-5 h-5" />
              Search Smart Matches
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">AI-Powered Matching</h3>
              </div>
              <p className="text-sm text-gray-600">
                Our algorithm analyzes carrier performance, equipment, and lane preferences
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Verified Carriers</h3>
              </div>
              <p className="text-sm text-gray-600">
                All carriers are verified with active insurance and authority
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900">Real-Time Availability</h3>
              </div>
              <p className="text-sm text-gray-600">
                See carrier availability and last active status instantly
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Loader */}
      {isSearching && (
        <SearchLoader 
          progress={searchProgress}
          message={searchMessage}
        />
      )}

      {/* Match Modal */}
      <CarrierMatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        carriers={matchedCarriers}
        onCallCarrier={handleCallCarrier}
        onEmailCarrier={handleEmailCarrier}
        contactedCarriers={contactedCarriers}
        savedCarriers={savedCarriers}
        onToggleSave={toggleSaveCarrier}
      />

      {/* Call Modal */}
      <CarrierCallModal
        isOpen={showCallModal}
        onClose={() => {
          setShowCallModal(false);
          setShowMatchModal(true);
        }}
        carrier={selectedCarrier}
        onSaveCall={handleSaveCall}
      />
    </div>
  );
};