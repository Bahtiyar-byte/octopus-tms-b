import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { toast } from 'react-hot-toast';

// Carrier interface
interface Carrier {
  id: string;
  name: string;
  mcNumber: string;
  equipmentTypes: string[];
  preferredLanes: string[];
  safetyRating: 'Satisfactory' | 'Conditional' | 'Unsatisfactory' | 'Not Rated';
  insuranceExpiration: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  matchScore?: number;
}

// Load interface
interface Load {
  id: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  commodity: string;
  weight: string;
  rate: string;
  equipmentType: string;
  status: string;
}

const CarrierMatch: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [inviteMessage, setInviteMessage] = useState<string>('');
  
  // Mock loads data (only Posted loads)
  const mockLoads: Load[] = [
    {
      id: 'BL-1236',
      origin: 'Miami, FL',
      destination: 'Charlotte, NC',
      pickupDate: '2025-06-17',
      deliveryDate: '2025-06-19',
      commodity: 'Retail Goods',
      weight: '18000',
      rate: '1950',
      equipmentType: 'Dry Van',
      status: 'Posted'
    },
    {
      id: 'BL-1240',
      origin: 'Houston, TX',
      destination: 'Memphis, TN',
      pickupDate: '2025-06-18',
      deliveryDate: '2025-06-20',
      commodity: 'Industrial Equipment',
      weight: '26000',
      rate: '2100',
      equipmentType: 'Flatbed',
      status: 'Posted'
    },
    {
      id: 'BL-1241',
      origin: 'Minneapolis, MN',
      destination: 'Detroit, MI',
      pickupDate: '2025-06-19',
      deliveryDate: '2025-06-20',
      commodity: 'Auto Parts',
      weight: '14000',
      rate: '1200',
      equipmentType: 'Dry Van',
      status: 'Posted'
    }
  ];
  
  // Mock carriers data
  const mockCarriers: Carrier[] = [
    {
      id: 'C1001',
      name: 'FastFreight Inc.',
      mcNumber: 'MC-123456',
      equipmentTypes: ['Dry Van', 'Reefer'],
      preferredLanes: ['FL-NC', 'GA-SC', 'FL-GA'],
      safetyRating: 'Satisfactory',
      insuranceExpiration: '2025-12-31',
      contactName: 'John Smith',
      contactPhone: '(555) 123-4567',
      contactEmail: 'john@fastfreight.example.com',
      notes: 'Reliable carrier with good track record.'
    },
    {
      id: 'C1002',
      name: 'Southwest Carriers',
      mcNumber: 'MC-234567',
      equipmentTypes: ['Flatbed', 'Step Deck'],
      preferredLanes: ['TX-TN', 'TX-OK', 'TX-LA'],
      safetyRating: 'Satisfactory',
      insuranceExpiration: '2025-10-15',
      contactName: 'Maria Rodriguez',
      contactPhone: '(555) 234-5678',
      contactEmail: 'maria@swcarriers.example.com',
      notes: 'Specializes in heavy equipment transport.'
    },
    {
      id: 'C1003',
      name: 'Midwest Express',
      mcNumber: 'MC-345678',
      equipmentTypes: ['Dry Van', 'Flatbed'],
      preferredLanes: ['MN-MI', 'IL-OH', 'WI-IN'],
      safetyRating: 'Conditional',
      insuranceExpiration: '2025-08-22',
      contactName: 'Robert Johnson',
      contactPhone: '(555) 345-6789',
      contactEmail: 'robert@midwestexpress.example.com',
      notes: 'Working on improving safety rating.'
    },
    {
      id: 'C1004',
      name: 'East Coast Logistics',
      mcNumber: 'MC-456789',
      equipmentTypes: ['Dry Van', 'Reefer'],
      preferredLanes: ['FL-NC', 'NY-MA', 'PA-VA'],
      safetyRating: 'Satisfactory',
      insuranceExpiration: '2025-11-30',
      contactName: 'Sarah Williams',
      contactPhone: '(555) 456-7890',
      contactEmail: 'sarah@eclogistics.example.com',
      notes: 'Excellent service on East Coast routes.'
    },
    {
      id: 'C1005',
      name: 'Pacific Transport',
      mcNumber: 'MC-567890',
      equipmentTypes: ['Reefer', 'Tanker'],
      preferredLanes: ['CA-WA', 'CA-OR', 'WA-OR'],
      safetyRating: 'Satisfactory',
      insuranceExpiration: '2026-01-15',
      contactName: 'David Chen',
      contactPhone: '(555) 567-8901',
      contactEmail: 'david@pacifictransport.example.com',
      notes: 'Specializes in refrigerated goods.'
    },
    {
      id: 'C1006',
      name: 'Mountain Haulers',
      mcNumber: 'MC-678901',
      equipmentTypes: ['Flatbed', 'Step Deck', 'Lowboy'],
      preferredLanes: ['CO-UT', 'CO-WY', 'UT-NV'],
      safetyRating: 'Satisfactory',
      insuranceExpiration: '2025-09-30',
      contactName: 'Michael Brown',
      contactPhone: '(555) 678-9012',
      contactEmail: 'michael@mountainhaulers.example.com',
      notes: 'Experienced with mountain routes and heavy loads.'
    }
  ];
  
  // Calculate match scores when a load is selected
  const getMatchedCarriers = () => {
    if (!selectedLoad) return [];
    
    return mockCarriers
      .filter(carrier => {
        // Filter by equipment type if not "All"
        if (equipmentFilter !== 'All' && !carrier.equipmentTypes.includes(equipmentFilter)) {
          return false;
        }
        
        // Filter by search term
        if (searchTerm && !carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !carrier.mcNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        return true;
      })
      .map(carrier => {
        // Calculate match score (0-100)
        let score = 0;
        
        // Equipment match (30 points)
        if (carrier.equipmentTypes.includes(selectedLoad.equipmentType)) {
          score += 30;
        }
        
        // Lane preference match (40 points)
        const lane = `${selectedLoad.origin.split(',')[1].trim()}-${selectedLoad.destination.split(',')[1].trim()}`;
        if (carrier.preferredLanes.includes(lane)) {
          score += 40;
        }
        
        // Safety rating (20 points)
        if (carrier.safetyRating === 'Satisfactory') {
          score += 20;
        } else if (carrier.safetyRating === 'Conditional') {
          score += 10;
        }
        
        // Insurance validity (10 points)
        const insuranceDate = new Date(carrier.insuranceExpiration);
        const loadDeliveryDate = new Date(selectedLoad.deliveryDate);
        if (insuranceDate > loadDeliveryDate) {
          score += 10;
        }
        
        return { ...carrier, matchScore: score };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };
  
  const matchedCarriers = getMatchedCarriers();
  
  // Get match score badge color
  const getMatchScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Handle carrier invite
  const handleInvite = () => {
    if (!selectedCarrier || !selectedLoad) return;
    
    // In a real app, this would send an invitation to the carrier
    toast.success(`Invitation sent to ${selectedCarrier.name} for load ${selectedLoad.id}`, {
      duration: 3000,
      icon: '📨'
    });
    
    setShowInviteModal(false);
    setInviteMessage('');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Carrier Match</h1>
        <button
          onClick={() => navigate('/broker/loads')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to Loads
        </button>
      </div>
      
      {/* Load Selection */}
      <Card className="bg-white shadow-md mb-6">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Select a Load to Match</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Load #
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockLoads.map((load) => (
                  <tr 
                    key={load.id} 
                    className={`hover:bg-gray-50 ${selectedLoad?.id === load.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {load.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {load.origin} → {load.destination}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(load.pickupDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {load.equipmentType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                      ${load.rate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedLoad(load)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          selectedLoad?.id === load.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        {selectedLoad?.id === load.id ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      
      {selectedLoad ? (
        <>
          {/* Carrier Matching */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-4">
              <h2 className="text-lg font-semibold">Matching Carriers for Load {selectedLoad.id}</h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search carriers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                <select
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Equipment</option>
                  <option value="Dry Van">Dry Van</option>
                  <option value="Reefer">Reefer</option>
                  <option value="Flatbed">Flatbed</option>
                  <option value="Step Deck">Step Deck</option>
                  <option value="Lowboy">Lowboy</option>
                  <option value="Tanker">Tanker</option>
                </select>
              </div>
            </div>
            
            {/* Rate Benchmark */}
            <Card className="bg-blue-50 shadow-sm mb-4">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Rate Benchmarking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Your Rate:</span>
                    <span className="ml-2">${selectedLoad.rate} (${(Number(selectedLoad.rate) / 750).toFixed(2)}/mile)</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Market Average:</span>
                    <span className="ml-2">${Math.floor(2.0 * 750)} (${(2.0).toFixed(2)}/mile)</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Rate Assessment:</span>
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Competitive
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Carriers List */}
            {matchedCarriers.length === 0 ? (
              <Card className="bg-white shadow-md p-8 text-center">
                <div className="text-gray-500">
                  <i className="fas fa-truck text-5xl mb-4"></i>
                  <h3 className="text-xl font-medium mb-2">No matching carriers found</h3>
                  <p>Try adjusting your filters or equipment type.</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedCarriers.map((carrier) => (
                  <Card key={carrier.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{carrier.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreBadgeClass(carrier.matchScore || 0)}`}>
                          {carrier.matchScore}% Match
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">MC Number:</div>
                          <div className="font-medium">{carrier.mcNumber}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Safety Rating:</div>
                          <div className="font-medium">{carrier.safetyRating}</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Equipment Types:</div>
                        <div className="flex flex-wrap gap-1">
                          {carrier.equipmentTypes.map((type) => (
                            <span 
                              key={type} 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                type === selectedLoad.equipmentType 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Preferred Lanes:</div>
                        <div className="flex flex-wrap gap-1">
                          {carrier.preferredLanes.map((lane) => (
                            <span 
                              key={lane} 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lane === `${selectedLoad.origin.split(',')[1].trim()}-${selectedLoad.destination.split(',')[1].trim()}`
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {lane}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Contact:</div>
                        <div className="font-medium">{carrier.contactName}</div>
                        <div className="text-sm text-gray-500">{carrier.contactPhone}</div>
                        <div className="text-sm text-gray-500">{carrier.contactEmail}</div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedCarrier(carrier);
                            setShowInviteModal(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-md shadow-sm flex items-center text-sm"
                        >
                          <i className="fas fa-paper-plane mr-2"></i> Send Invite
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <Card className="bg-white shadow-md p-8 text-center">
          <div className="text-gray-500">
            <i className="fas fa-truck-loading text-5xl mb-4"></i>
            <h3 className="text-xl font-medium mb-2">Select a load to find matching carriers</h3>
            <p>Choose from the available loads above to see carrier matches.</p>
          </div>
        </Card>
      )}
      
      {/* Invite Modal */}
      {showInviteModal && selectedCarrier && selectedLoad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Send Invitation to {selectedCarrier.name}</h3>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Load:</div>
                <div className="font-medium">{selectedLoad.id} - {selectedLoad.origin} to {selectedLoad.destination}</div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="inviteMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  id="inviteMessage"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional details about this load..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarrierMatch;