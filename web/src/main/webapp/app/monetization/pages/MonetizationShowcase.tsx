import React, { useState } from 'react';
import { 
  Star, 
  Phone, 
  Mail, 
  Truck, 
  Shield, 
  Clock, 
  TrendingUp,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  PhoneOff, 
  User, 
  Building2, 
  MessageSquare,
  Save,
  Volume2,
  Mic,
  MicOff,
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package,
  Bell,
  Sparkles,
  Filter
} from 'lucide-react';

// Mock data for components
const mockLoads = [
  {
    id: 'LD1001',
    origin: 'Chicago, IL',
    destination: 'New York, NY',
    miles: 750,
    equipmentType: 'Dry Van',
    rate: 2850,
    ratePerMile: 3.80,
    pickupDate: 'May 22, 2025',
    deliveryDate: 'May 24, 2025',
    broker: 'ABC Logistics',
    weight: '42,000 lbs',
    status: 'Ready for pickup'
  },
  {
    id: 'LD1002',
    origin: 'Dallas, TX',
    destination: 'Houston, TX',
    miles: 240,
    equipmentType: 'Reefer',
    rate: 950,
    ratePerMile: 3.96,
    pickupDate: 'May 22, 2025',
    deliveryDate: 'May 23, 2025',
    broker: 'Fresh Foods Inc.',
    weight: '38,000 lbs',
    status: 'Premium rate',
    tags: ['34°F Required']
  }
];

const mockCarriers = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Smith Transport LLC',
    phone: '+1 (555) 123-4567',
    email: 'john@smithtransport.com',
    rating: 4.8,
    mcNumber: 'MC-123456',
    dotNumber: 'DOT-789012',
    matchScore: 95,
    onTimePercentage: 98,
    totalLoads: 342,
    insuranceCoverage: 1000000,
    equipmentTypes: ['Dry Van', 'Reefer'],
    availability: 'available',
    lastActive: '2 hours ago',
    notes: 'Preferred carrier for Chicago lanes, excellent communication'
  },
  {
    id: '2', 
    name: 'Sarah Johnson',
    company: 'Johnson Logistics',
    phone: '+1 (555) 234-5678',
    email: 'sarah@johnsonlogistics.com',
    rating: 4.6,
    mcNumber: 'MC-234567',
    dotNumber: 'DOT-890123',
    matchScore: 88,
    onTimePercentage: 95,
    totalLoads: 256,
    insuranceCoverage: 1500000,
    equipmentTypes: ['Flatbed', 'Step Deck'],
    availability: 'busy',
    lastActive: '30 min ago'
  }
];

const brokerIntegrations = [
  // Load Boards
  { id: 'dat', name: 'DAT Load Board', description: 'Access to 1M+ loads daily', category: 'Load Boards', icon: 'fa-truck', iconBg: 'bg-blue-100 text-blue-600', isConnected: true, apiKey: 'DAT-API-KEY-12345' },
  { id: 'truckstop', name: 'TruckStop', description: 'Real-time freight matching', category: 'Load Boards', icon: 'fa-shipping-fast', iconBg: 'bg-green-100 text-green-600', isConnected: true, apiKey: 'TRUCKSTOP-API-KEY-67890' },
  { id: '123loadboard', name: '123LoadBoard', description: 'Direct shipper connections', category: 'Load Boards', icon: 'fa-road', iconBg: 'bg-purple-100 text-purple-600', isConnected: false, apiKey: '' },
  
  // Tracking
  { id: 'samsara', name: 'Samsara ELD', description: 'Real-time GPS tracking', category: 'Tracking', icon: 'fa-location-dot', iconBg: 'bg-orange-100 text-orange-600', isConnected: true, apiKey: 'SAMSARA-API-KEY-11111' },
  { id: 'project44', name: 'Project44', description: 'Supply chain visibility', category: 'Tracking', icon: 'fa-eye', iconBg: 'bg-indigo-100 text-indigo-600', isConnected: false, apiKey: '' },
  { id: 'fourkites', name: 'FourKites', description: 'Predictive visibility platform', category: 'Tracking', icon: 'fa-chart-line', iconBg: 'bg-teal-100 text-teal-600', isConnected: false, apiKey: '' },
  
  // Accounting
  { id: 'quickbooks', name: 'QuickBooks', description: 'Automated invoicing & payments', category: 'Accounting', icon: 'fa-calculator', iconBg: 'bg-emerald-100 text-emerald-600', isConnected: true, apiKey: 'QUICKBOOKS-API-KEY-22222' },
  { id: 'triumph', name: 'Triumph Factoring', description: 'Same-day funding for invoices', category: 'Accounting', icon: 'fa-money-bill-wave', iconBg: 'bg-yellow-100 text-yellow-600', isConnected: false, apiKey: '' },
  
  // Compliance
  { id: 'rmis', name: 'RMIS Insurance', description: 'Certificate tracking & verification', category: 'Compliance', icon: 'fa-shield-halved', iconBg: 'bg-red-100 text-red-600', isConnected: true, apiKey: 'RMIS-API-KEY-33333' },
  { id: 'carrierwatch', name: 'CarrierWatch', description: 'Carrier monitoring & alerts', category: 'Compliance', icon: 'fa-user-shield', iconBg: 'bg-slate-100 text-slate-600', isConnected: false, apiKey: '' },
  
  // Communication
  { id: 'twilio', name: 'Twilio SMS', description: 'Automated text notifications', category: 'Communication', icon: 'fa-comment-sms', iconBg: 'bg-pink-100 text-pink-600', isConnected: true, apiKey: 'TWILIO-API-KEY-44444' }
];

const MonetizationShowcase: React.FC = () => {
  const [searchingLoads, setSearchingLoads] = useState(false);
  const [searchingCarriers, setSearchingCarriers] = useState(false);
  const [showCarrierCallModal, setShowCarrierCallModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(mockCarriers[0]);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [commissionSettings, setCommissionSettings] = useState({
    baseRate: 6,
    tier1Rate: 8,
    tier1Threshold: 100000,
    tier2Rate: 10,
    tier2Threshold: 250000,
    tier3Rate: 12,
    tier3Threshold: 500000,
    paymentSchedule: 'monthly',
    paymentDay: 15
  });

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐙 Octopus TMS - Monetization Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Revenue-Generating Features & Components Gallery
          </p>
        </div>

        {/* 1. Smart Load Search - Found Match (Carrier) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            1. Smart Load Search - Found Match (Carrier)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              {mockLoads.map((load) => (
                <div key={load.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">#{load.id}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          load.status === 'Premium rate' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {load.status}
                        </span>
                        {load.tags?.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="font-medium">{load.origin}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium">{load.destination}</span>
                        <span className="ml-3 text-sm text-gray-500">({load.miles} miles)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(load.rate)}</p>
                      <p className="text-sm text-gray-500">${load.ratePerMile}/mile</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Equipment:</span>
                      <span className="ml-1 font-medium">{load.equipmentType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <span className="ml-1 font-medium">{load.weight}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Pickup:</span>
                      <span className="ml-1 font-medium">{load.pickupDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Broker:</span>
                      <span className="ml-1 font-medium">{load.broker}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Book Load
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Call Broker
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Smart Load Search - Loading Animation (Carrier) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            2. Smart Load Search - Loading Animation (Carrier)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button 
              onClick={() => setSearchingLoads(!searchingLoads)}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {searchingLoads ? 'Stop Demo' : 'Start Search Demo'}
            </button>
            
            {searchingLoads && (
              <div className="relative bg-gray-50 rounded-lg p-8">
                <div className="text-center space-y-6">
                  <div className="relative inline-flex items-center justify-center">
                    <span className="absolute inline-flex h-20 w-20 rounded-full bg-blue-400 opacity-25 animate-ping"></span>
                    <span className="text-5xl animate-bounce">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Your Perfect Load</h3>
                    <p className="text-gray-600 animate-pulse">Searching DAT load board...</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-blue-600 animate-pulse">97</p>
                      <p className="text-xs text-gray-500">Loads Scanned</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-600 animate-pulse">5</p>
                      <p className="text-xs text-gray-500">Matches Found</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-purple-600 animate-pulse">3s</p>
                      <p className="text-xs text-gray-500">Time Left</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">Pro Tip:</span> We're matching loads based on your route preferences, 
                      equipment type, and historical performance data.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Smart Carrier Match - Call in Progress Modal (Broker) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            3. Smart Carrier Match - Call in Progress Modal (Broker)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button 
              onClick={() => setShowCarrierCallModal(!showCarrierCallModal)}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showCarrierCallModal ? 'Close Call Demo' : 'Open Call Demo'}
            </button>
            
            {showCarrierCallModal && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${callActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Phone className={`w-6 h-6 ${callActive ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {callActive ? 'Connected' : 'Connecting...'} to {selectedCarrier.company}
                  </p>
                </div>

                <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <div className={`w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center ${
                      callActive ? 'animate-pulse' : ''
                    }`}>
                      <Phone className="w-12 h-12 text-white" />
                    </div>
                    {callActive && (
                      <div className="absolute -inset-2 bg-blue-600 rounded-full opacity-20 animate-ping" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedCarrier.name}</h3>
                    <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {selectedCarrier.company}
                    </p>
                    <p className="text-xl font-mono text-blue-600">📱 {selectedCarrier.phone}</p>
                  </div>

                  {callActive && (
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span className="text-2xl font-mono">{formatDuration(callDuration)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4 mt-6">
                    {callActive ? (
                      <>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={`p-4 rounded-full transition-colors ${
                            isMuted 
                              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        <button
                          onClick={() => setCallActive(false)}
                          className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        >
                          <PhoneOff className="w-8 h-8" />
                        </button>
                        <button className="p-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                          <Volume2 className="w-6 h-6" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setCallActive(true)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
                      >
                        <Phone className="w-5 h-5" />
                        Start Call
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MessageSquare className="w-4 h-4" />
                    Call Notes
                  </label>
                  <textarea
                    placeholder="Jot down important details from the call..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Save className="w-4 h-4" />
                    Save Call Notes
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Carrier Quick Info</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700">Rating:</span>
                      <span className="ml-2 font-medium text-blue-900">⭐ {selectedCarrier.rating}/5</span>
                    </div>
                    <div>
                      <span className="text-blue-700">On-Time:</span>
                      <span className="ml-2 font-medium text-blue-900">{selectedCarrier.onTimePercentage}%</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Total Loads:</span>
                      <span className="ml-2 font-medium text-blue-900">{selectedCarrier.totalLoads}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Insurance:</span>
                      <span className="ml-2 font-medium text-blue-900">${(selectedCarrier.insuranceCoverage / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. Commission Structure Settings (Broker) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            4. Commission Structure Settings (Broker)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Commission Structure</h3>
              <p className="text-sm text-gray-600 mb-6">
                Configure commission rates and payment schedules for your sales team
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Commission Tiers</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Base Rate (0 - ${commissionSettings.tier1Threshold.toLocaleString()})
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            step="0.5"
                            value={commissionSettings.baseRate}
                            onChange={(e) => setCommissionSettings({...commissionSettings, baseRate: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tier 1 Threshold
                        </label>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={commissionSettings.tier1Threshold}
                            onChange={(e) => setCommissionSettings({...commissionSettings, tier1Threshold: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tier 1 Rate (${commissionSettings.tier1Threshold.toLocaleString()} - ${commissionSettings.tier2Threshold.toLocaleString()})
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            step="0.5"
                            value={commissionSettings.tier1Rate}
                            onChange={(e) => setCommissionSettings({...commissionSettings, tier1Rate: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tier 2 Threshold
                        </label>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={commissionSettings.tier2Threshold}
                            onChange={(e) => setCommissionSettings({...commissionSettings, tier2Threshold: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tier 2 Rate (${commissionSettings.tier2Threshold.toLocaleString()} - ${commissionSettings.tier3Threshold.toLocaleString()})
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            step="0.5"
                            value={commissionSettings.tier2Rate}
                            onChange={(e) => setCommissionSettings({...commissionSettings, tier2Rate: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tier 3 Threshold
                        </label>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={commissionSettings.tier3Threshold}
                            onChange={(e) => setCommissionSettings({...commissionSettings, tier3Threshold: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tier 3 Rate (${commissionSettings.tier3Threshold.toLocaleString()}+)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            step="0.5"
                            value={commissionSettings.tier3Rate}
                            onChange={(e) => setCommissionSettings({...commissionSettings, tier3Rate: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Frequency
                      </label>
                      <select
                        value={commissionSettings.paymentSchedule}
                        onChange={(e) => setCommissionSettings({...commissionSettings, paymentSchedule: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Day
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={commissionSettings.paymentDay}
                        onChange={(e) => setCommissionSettings({...commissionSettings, paymentDay: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Save Commission Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Smart Carrier Match - Scanning UI (Broker) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            5. Smart Carrier Match - Scanning UI (Broker)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button 
              onClick={() => setSearchingCarriers(!searchingCarriers)}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {searchingCarriers ? 'Stop Demo' : 'Start Carrier Search Demo'}
            </button>
            
            {searchingCarriers && (
              <div className="relative bg-gray-50 rounded-lg p-8">
                <div className="text-center space-y-6">
                  <div className="relative inline-flex items-center justify-center">
                    <span className="absolute inline-flex h-20 w-20 rounded-full bg-blue-400 opacity-25 animate-ping"></span>
                    <span className="text-5xl animate-bounce">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Perfect Carriers</h3>
                    <p className="text-gray-600 animate-pulse">Analyzing carrier profiles...</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-blue-600 animate-pulse">67</p>
                      <p className="text-xs text-gray-500">Carriers Scanned</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-600 animate-pulse">2</p>
                      <p className="text-xs text-gray-500">Matches Found</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-purple-600 animate-pulse">5s</p>
                      <p className="text-xs text-gray-500">Time Left</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">Pro Tip:</span> We're matching carriers based on equipment compatibility, 
                      lane preferences, safety ratings, and insurance status.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Smart Carrier Match - Results List UI (Broker) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            6. Smart Carrier Match - Results List UI (Broker)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">
                {mockCarriers.length} carriers matched your load requirements
              </p>
            </div>
            
            <div className="space-y-4">
              {mockCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="border rounded-xl p-5 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{carrier.company}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{carrier.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>MC# {carrier.mcNumber}</span>
                        <span className="text-gray-400">•</span>
                        <span>DOT# {carrier.dotNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      </button>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        carrier.matchScore >= 90 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {carrier.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{carrier.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">Rating</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{carrier.onTimePercentage}%</span>
                        <span className="text-xs text-gray-500 ml-1">On-Time</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{carrier.totalLoads}</span>
                        <span className="text-xs text-gray-500 ml-1">Loads</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          ${(carrier.insuranceCoverage / 1000000).toFixed(1)}M
                        </span>
                        <span className="text-xs text-gray-500 ml-1">Insurance</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Equipment:</span>
                      <div className="flex gap-1">
                        {carrier.equipmentTypes.map((type, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        carrier.availability === 'available' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {carrier.availability === 'available' ? '🟢 Available Now' : '🟡 Currently Busy'}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {carrier.lastActive}
                      </span>
                    </div>
                    {carrier.notes && (
                      <div className="text-sm bg-blue-50 text-blue-700 p-2 rounded-lg">
                        💡 {carrier.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                      <Phone className="w-4 h-4" />
                      Call Carrier
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      <Mail className="w-4 h-4" />
                      Email Carrier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Smart Load Match Dashboard/Entry Form (Broker) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            7. Smart Load Match Dashboard/Entry Form (Broker)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Find the Perfect Carrier</h3>
              <p className="text-sm text-gray-500">Enter your load details to match with qualified carriers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Origin
                </label>
                <input
                  type="text"
                  defaultValue="Chicago, IL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Destination
                </label>
                <input
                  type="text"
                  defaultValue="New York, NY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Truck className="w-4 h-4 inline mr-1" />
                  Equipment Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Dry Van</option>
                  <option>Reefer</option>
                  <option>Flatbed</option>
                  <option>Step Deck</option>
                  <option>RGN</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Target Rate
                </label>
                <input
                  type="number"
                  defaultValue="2500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  defaultValue="35000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter weight"
                />
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">AI Matching</h4>
                  <p className="text-xs text-gray-600 mt-1">Smart algorithm finds best carriers</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Verified Carriers</h4>
                  <p className="text-xs text-gray-600 mt-1">Pre-screened for safety & insurance</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Real-Time Availability</h4>
                  <p className="text-xs text-gray-600 mt-1">Live carrier status updates</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Search for Carriers
              </button>
            </div>
          </div>
        </section>

        {/* 8. API Integrations Panel (Broker) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            8. API Integrations Panel (Broker)
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-xl font-semibold text-gray-900">API Integrations</h3>
              <p className="text-sm text-gray-600 mt-1">Connect with third-party services and APIs</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Connected Services</h4>
                <p className="text-sm text-gray-600">Manage your API connections and integrations</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <i className="fas fa-plus mr-2"></i> Add Integration
              </button>
            </div>

            <div className="space-y-4">
              {/* Show first 3 integrations as examples */}
              {brokerIntegrations.slice(0, 3).map(integration => (
                <div key={integration.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${integration.iconBg}`}>
                          <i className={`fas ${integration.icon}`}></i>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-gray-900">{integration.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={integration.isConnected} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {integration.isConnected && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                          <div className="flex">
                            <input 
                              type="text" 
                              value={integration.apiKey} 
                              readOnly 
                              className="flex-grow px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-l-md"
                            />
                            <button className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors">
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                            <i className="fas fa-sync-alt mr-1"></i> Sync Now
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                            <i className="fas fa-cog mr-1"></i> Settings
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Individual API Integration Components */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            9. Individual API Integration Components
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Available Integrations</h3>
            
            {/* Group integrations by category */}
            {Object.entries(
              brokerIntegrations.reduce((acc, integration) => {
                if (!acc[integration.category]) {
                  acc[integration.category] = [];
                }
                acc[integration.category].push(integration);
                return acc;
              }, {} as Record<string, typeof brokerIntegrations>)
            ).map(([category, integrations]) => (
              <div key={category} className="mb-8">
                <h4 className="text-md font-semibold text-gray-800 mb-3">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {integrations.map(integration => (
                    <div key={integration.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${integration.iconBg} mr-3`}>
                            <i className={`fas ${integration.icon} text-sm`}></i>
                          </div>
                          <h5 className="font-medium text-gray-900">{integration.name}</h5>
                        </div>
                        {integration.isConnected && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                      <button className={`w-full text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                        integration.isConnected 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        {integration.isConnected ? 'Manage' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 py-8">
          <p>💰 Each component represents a monetizable feature in Octopus TMS</p>
          <p className="mt-2">Ready for Salesforce-style pricing model implementation</p>
        </div>
      </div>
    </div>
  );
};

export default MonetizationShowcase;