import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal } from '../../../components';
import { notify } from '../../../services';
import { SearchLoader } from '../../../components/loaders/SearchLoader';
import { LoadMatchModal } from '../../shared/components/LoadMatchModal';
import { BrokerCallModal } from '../../shared/components/BrokerCallModal';
import { useLoadMatcher } from '../hooks/useLoadMatcher';
import MapboxAddressInput from '../../shipper/components/MapboxAddressInput';
import type { GeocodingFeature } from '@mapbox/search-js-core';
import { commonDestinations } from '../../../data/shipperLocations';

interface SearchFilters {
  origin: string;
  destination: string;
  originCoordinates?: { lat: number; lon: number } | null;
  destinationCoordinates?: { lat: number; lon: number } | null;
  equipmentType: string;
  date: string;
  minRate: string;
}

interface Load {
  id: string;
  origin: string;
  destination: string;
  miles: number;
  equipmentType: string;
  rate: number;
  ratePerMile: number;
  pickupDate: string;
  deliveryDate: string;
  broker: string;
  weight: string;
  status: string;
  tags?: string[];
}

interface SavedLane {
  id: string;
  origin: string;
  destination: string;
  equipmentType: string;
  minRate: number;
  matchingLoads: number;
  emailAlerts: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
}

const SmartLoadSearch: React.FC = () => {
  // Search filters state
  const [filters, setFilters] = useState<SearchFilters>({
    origin: '',
    destination: '',
    equipmentType: '',
    date: '',
    minRate: ''
  });

  // Mock data for loads
  const mockLoads: Load[] = [
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
    },
    {
      id: 'LD1003',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      miles: 175,
      equipmentType: 'Flatbed',
      rate: 795,
      ratePerMile: 4.54,
      pickupDate: 'May 23, 2025',
      deliveryDate: 'May 23, 2025',
      broker: 'Pacific Shipping Co.',
      weight: '32,000 lbs',
      status: 'Tarping required',
      tags: ['Oversized Load']
    }
  ];

  // Mock data for saved lanes
  const initialSavedLanes: SavedLane[] = [
    {
      id: 'SL1001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      equipmentType: 'Dry Van',
      minRate: 2500,
      matchingLoads: 5,
      emailAlerts: true
    },
    {
      id: 'SL1002',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      equipmentType: 'Reefer',
      minRate: 1800,
      matchingLoads: 3,
      emailAlerts: true
    }
  ];

  // State variables
  const [loads, setLoads] = useState<Load[]>(mockLoads);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>(mockLoads);
  const [savedLoads, setSavedLoads] = useState<string[]>([]);
  const [savedLanes, setSavedLanes] = useState<SavedLane[]>(initialSavedLanes);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Modal states
  const [showSaveSearchModal, setShowSaveSearchModal] = useState<boolean>(false);
  const [showSetAlertModal, setShowSetAlertModal] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showAddLaneModal, setShowAddLaneModal] = useState<boolean>(false);
  const [showEditLaneModal, setShowEditLaneModal] = useState<boolean>(false);

  // Selected item states
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [selectedLane, setSelectedLane] = useState<SavedLane | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [newLane, setNewLane] = useState<Partial<SavedLane>>({
    origin: '',
    destination: '',
    equipmentType: 'Dry Van',
    minRate: 0,
    emailAlerts: true
  });
  
  // Use the load matcher hook
  const {
    isSearching,
    matchedLoads,
    showLoadModal,
    showCallModal,
    selectedLoad: selectedMatchedLoad,
    startSearch,
    setShowLoadModal,
    setShowCallModal,
    handleCallBroker,
    handleEmailBroker,
    handleRejectLoad,
    handleSaveForLater,
    handleSaveCallNotes
  } = useLoadMatcher();

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Clear filters
  const handleClear = () => {
    setFilters({
      origin: '',
      destination: '',
      equipmentType: '',
      date: '',
      minRate: ''
    });
  };

  // Search loads
  const handleSearch = async () => {
    if (!filters.origin || !filters.destination) {
      notify('Please enter origin and destination', 'error');
      return;
    }
    
    if (!filters.equipmentType) {
      notify('Please select equipment type', 'error');
      return;
    }

    // Start the smart search process
    startSearch({
      origin: filters.origin,
      destination: filters.destination,
      equipment: filters.equipmentType,
      minRate: filters.minRate ? parseFloat(filters.minRate) : 2000,
      date: filters.date || new Date().toLocaleDateString()
    });
  };

  // Save search
  const handleSaveSearch = () => {
    setShowSaveSearchModal(true);
  };

  // Save search submit
  const handleSaveSearchSubmit = async () => {
    if (!searchName.trim()) {
      notify('Please enter a name for this search', 'error');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      const newSavedSearch: SavedSearch = {
        id: `SS${Math.floor(1000 + Math.random() * 9000)}`,
        name: searchName,
        filters: { ...filters }
      };

      setSavedSearches(prev => [...prev, newSavedSearch]);
      setShowSaveSearchModal(false);
      setSearchName('');
      notify(`Search "${searchName}" saved successfully`);
    } catch (error) {
      console.error('Error saving search:', error);
      notify('Error saving search. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Set alert
  const handleSetAlert = () => {
    setShowSetAlertModal(true);
  };

  // Set alert submit
  const handleSetAlertSubmit = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      setShowSetAlertModal(false);
      notify('Alert set successfully. You will be notified when new loads match your criteria.');
    } catch (error) {
      console.error('Error setting alert:', error);
      notify('Error setting alert. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save/bookmark load
  const handleSaveLoad = async (load: Load) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      if (savedLoads.includes(load.id)) {
        setSavedLoads(prev => prev.filter(id => id !== load.id));
        notify(`Load ${load.id} removed from saved loads`);
      } else {
        setSavedLoads(prev => [...prev, load.id]);
        notify(`Load ${load.id} saved successfully`);
      }
    } catch (error) {
      console.error('Error saving load:', error);
      notify('Error saving load. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Book load
  const handleBookLoad = (load: Load) => {
    setSelectedLoad(load);
    setShowBookingModal(true);
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!selectedLoad) return;

    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      setShowBookingModal(false);
      notify(`Load ${selectedLoad.id} booked successfully`);

      // Remove the booked load from the list
      setFilteredLoads(prev => prev.filter(load => load.id !== selectedLoad.id));
    } catch (error) {
      console.error('Error booking load:', error);
      notify('Error booking load. Please try again.', 'error');
    } finally {
      setLoading(false);
      setSelectedLoad(null);
    }
  };

  // Load more results
  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      // In a real app, this would be an API call to get more loads
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // For demo purposes, we'll just add the same loads again with different IDs
      const moreLoads = mockLoads.map(load => ({
        ...load,
        id: `LD${Math.floor(1000 + Math.random() * 9000)}`
      }));

      setFilteredLoads(prev => [...prev, ...moreLoads]);
      notify(`Loaded ${moreLoads.length} more results`);
    } catch (error) {
      console.error('Error loading more results:', error);
      notify('Error loading more results. Please try again.', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  // Add new lane
  const handleAddLane = () => {
    setNewLane({
      origin: '',
      destination: '',
      equipmentType: 'Dry Van',
      minRate: 0,
      emailAlerts: true
    });
    setShowAddLaneModal(true);
  };

  // Add lane submit
  const handleAddLaneSubmit = async () => {
    if (!newLane.origin || !newLane.destination) {
      notify('Please enter origin and destination', 'error');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      const newSavedLane: SavedLane = {
        id: `SL${Math.floor(1000 + Math.random() * 9000)}`,
        origin: newLane.origin || '',
        destination: newLane.destination || '',
        equipmentType: newLane.equipmentType || 'Dry Van',
        minRate: newLane.minRate || 0,
        matchingLoads: Math.floor(Math.random() * 5) + 1, // Random number of matching loads
        emailAlerts: newLane.emailAlerts || false
      };

      setSavedLanes(prev => [...prev, newSavedLane]);
      setShowAddLaneModal(false);
      notify(`Lane ${newSavedLane.origin} → ${newSavedLane.destination} added successfully`);
    } catch (error) {
      console.error('Error adding lane:', error);
      notify('Error adding lane. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit lane
  const handleEditLane = (lane: SavedLane) => {
    setSelectedLane(lane);
    setNewLane({ ...lane });
    setShowEditLaneModal(true);
  };

  // Edit lane submit
  const handleEditLaneSubmit = async () => {
    if (!selectedLane || !newLane.origin || !newLane.destination) {
      notify('Please enter origin and destination', 'error');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      setSavedLanes(prev => prev.map(lane => 
        lane.id === selectedLane.id 
          ? { 
              ...lane, 
              origin: newLane.origin || lane.origin,
              destination: newLane.destination || lane.destination,
              equipmentType: newLane.equipmentType || lane.equipmentType,
              minRate: newLane.minRate || lane.minRate,
              emailAlerts: newLane.emailAlerts !== undefined ? newLane.emailAlerts : lane.emailAlerts
            } 
          : lane
      ));

      setShowEditLaneModal(false);
      notify(`Lane updated successfully`);
    } catch (error) {
      console.error('Error updating lane:', error);
      notify('Error updating lane. Please try again.', 'error');
    } finally {
      setLoading(false);
      setSelectedLane(null);
    }
  };

  // Delete lane
  const handleDeleteLane = async (lane: SavedLane) => {
    if (!confirm(`Are you sure you want to delete the lane ${lane.origin} → ${lane.destination}?`)) {
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      setSavedLanes(prev => prev.filter(l => l.id !== lane.id));
      notify(`Lane deleted successfully`);
    } catch (error) {
      console.error('Error deleting lane:', error);
      notify('Error deleting lane. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // View matches
  const handleViewMatches = async (lane: SavedLane) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to get matching loads
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      // Filter loads based on lane criteria
      const matches = mockLoads.filter(load => {
        const matchesOrigin = load.origin.includes(lane.origin);
        const matchesDestination = load.destination.includes(lane.destination);
        const matchesEquipment = load.equipmentType === lane.equipmentType;
        const matchesRate = load.rate >= lane.minRate;

        return matchesOrigin && matchesDestination && matchesEquipment && matchesRate;
      });

      setFilteredLoads(matches);
      notify(`Showing ${matches.length} loads matching your saved lane`);

      // Update filters to match the lane
      setFilters({
        origin: lane.origin,
        destination: lane.destination,
        equipmentType: lane.equipmentType,
        date: '',
        minRate: lane.minRate.toString()
      });

      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error viewing matches:', error);
      notify('Error viewing matches. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toggle email alerts
  const handleToggleEmailAlerts = async (lane: SavedLane) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      setSavedLanes(prev => prev.map(l => 
        l.id === lane.id ? { ...l, emailAlerts: !l.emailAlerts } : l
      ));

      notify(`Email alerts ${lane.emailAlerts ? 'disabled' : 'enabled'} for lane ${lane.origin} → ${lane.destination}`);
    } catch (error) {
      console.error('Error toggling email alerts:', error);
      notify('Error toggling email alerts. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Load Search</h1>
          <p className="text-gray-600">Find and book available loads across the country</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/all-loads"
            className="btn btn-outline-secondary flex items-center"
          >
            <i className="fas fa-table mr-2"></i>View All Loads
          </Link>
          <button 
            className="btn btn-outline-secondary"
            onClick={handleSaveSearch}
            disabled={loading}
          >
            <i className="fas fa-save mr-2"></i>Save Search
          </button>
          <button 
            className="btn btn-outline-primary"
            onClick={handleSetAlert}
            disabled={loading}
          >
            <i className="fas fa-bell mr-2"></i>Set Alert
          </button>
        </div>
      </div>

      <Card className="mb-6 shadow-md hover:shadow-lg transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <MapboxAddressInput
              label="Origin"
              value={filters.origin}
              onChange={(value) => setFilters({ ...filters, origin: value })}
              onFeatureSelect={(feature: GeocodingFeature) => {
                if (feature?.geometry?.coordinates) {
                  setFilters({
                    ...filters,
                    origin: feature.properties.full_address || filters.origin,
                    originCoordinates: {
                      lat: feature.geometry.coordinates[1],
                      lon: feature.geometry.coordinates[0]
                    }
                  });
                }
              }}
              savedLocations={commonDestinations}
              placeholder="Search pickup location"
              required={false}
            />
          </div>
          <div>
            <MapboxAddressInput
              label="Destination"
              value={filters.destination}
              onChange={(value) => setFilters({ ...filters, destination: value })}
              onFeatureSelect={(feature: GeocodingFeature) => {
                if (feature?.geometry?.coordinates) {
                  setFilters({
                    ...filters,
                    destination: feature.properties.full_address || filters.destination,
                    destinationCoordinates: {
                      lat: feature.geometry.coordinates[1],
                      lon: feature.geometry.coordinates[0]
                    }
                  });
                }
              }}
              savedLocations={commonDestinations}
              placeholder="Search delivery location"
              required={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="equipmentType" className="form-label">Equipment Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-truck text-gray-400"></i>
              </div>
              <select 
                className="form-select pl-10" 
                id="equipmentType"
                value={filters.equipmentType}
                onChange={handleInputChange}
              >
                <option value="">Any</option>
                <option value="dry_van">Dry Van</option>
                <option value="reefer">Reefer</option>
                <option value="flatbed">Flatbed</option>
                <option value="step_deck">Step Deck</option>
                <option value="lowboy">Lowboy</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="date" className="form-label">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-calendar-alt text-gray-400"></i>
              </div>
              <input 
                type="date" 
                className="form-control pl-10" 
                id="date"
                value={filters.date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="minRate" className="form-label">Minimum Rate</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-dollar-sign text-gray-400"></i>
              </div>
              <input 
                type="number" 
                className="form-control pl-10" 
                id="minRate" 
                placeholder="0.00"
                value={filters.minRate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleClear}
          >
            <i className="fas fa-times mr-2"></i>Clear
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <i className="fas fa-search mr-2"></i>Search Loads
              </>
            )}
          </button>
        </div>
      </Card>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fas fa-truck-loading mr-2 text-blue-600"></i>
            Available Loads
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-filter mr-2"></i>
            <span>{filteredLoads.length} loads found</span>
          </div>
        </div>

        {loading && filteredLoads.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLoads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <i className="fas fa-search text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No loads found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Try adjusting your search criteria to find more loads.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  handleClear();
                  setFilteredLoads(mockLoads);
                }}
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLoads.map(load => (
              <div 
                key={load.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-12 md:col-span-3 mb-3 md:mb-0">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-2 hidden md:block">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{load.origin} → {load.destination}</div>
                        <div className="text-gray-600 flex items-center mt-1">
                          <span>{load.miles} miles</span>
                          <span className="mx-2">•</span>
                          <span>{load.equipmentType}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <div className="flex items-start md:justify-center">
                      <div>
                        <div className="font-semibold text-gray-900">${load.rate.toLocaleString()}</div>
                        <div className="text-green-600 font-medium">${load.ratePerMile.toFixed(2)}/mile</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <div className="flex items-start md:justify-center">
                      <div>
                        <div className="font-semibold text-gray-900">{load.pickupDate}</div>
                        <div className="text-gray-600">Delivery: {load.deliveryDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-3 mt-3 md:mt-0">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className={`btn-sm ${savedLoads.includes(load.id) ? 'btn-secondary' : 'btn-outline-primary'} flex items-center`}
                        onClick={() => handleSaveLoad(load)}
                        disabled={loading}
                      >
                        <i className={`${savedLoads.includes(load.id) ? 'fas' : 'far'} fa-bookmark mr-1`}></i>
                        <span>{savedLoads.includes(load.id) ? 'Saved' : 'Save'}</span>
                      </button>
                      <button 
                        className="btn-sm btn-primary flex items-center"
                        onClick={() => handleBookLoad(load)}
                        disabled={loading}
                      >
                        <i className="fas fa-check-circle mr-1"></i>
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 border-t border-gray-100 hidden md:block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-building mr-1"></i>
                        <span>{load.broker}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-weight mr-1"></i>
                        <span>{load.weight}</span>
                      </div>
                      {load.tags && load.tags.map((tag, index) => (
                        <div key={index} className="flex items-center text-gray-600">
                          <i className={`fas ${tag.includes('°F') ? 'fa-thermometer-half' : tag.includes('Oversized') ? 'fa-ruler' : 'fa-tag'} mr-1`}></i>
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className={`py-1 px-2 rounded-full ${
                        load.status === 'Premium rate' ? 'bg-blue-100 text-blue-800' :
                        load.status === 'Tarping required' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {load.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredLoads.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button 
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent mr-2"></div>
                  Loading more...
                </>
              ) : (
                <>Load more results</>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fas fa-star mr-2 text-yellow-500"></i>
            Saved Lanes
          </h2>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            onClick={handleAddLane}
            disabled={loading}
          >
            <i className="fas fa-plus-circle mr-1"></i>
            Add New Lane
          </button>
        </div>

        {savedLanes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <i className="fas fa-road text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No saved lanes</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Save your favorite lanes to get notified when new loads are available.
              </p>
              <button 
                className="btn btn-primary"
                onClick={handleAddLane}
              >
                Add Your First Lane
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {savedLanes.map(lane => (
              <div 
                key={lane.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <div className="font-medium text-gray-900">{lane.origin} → {lane.destination}</div>
                  <div className="flex space-x-1">
                    <button 
                      className="p-1 text-gray-500 hover:text-blue-600"
                      onClick={() => handleEditLane(lane)}
                      disabled={loading}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="p-1 text-gray-500 hover:text-red-600"
                      onClick={() => handleDeleteLane(lane)}
                      disabled={loading}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Equipment</div>
                      <div className="font-medium">{lane.equipmentType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Min Rate</div>
                      <div className="font-medium">${lane.minRate.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Matching Loads</div>
                      <div className="font-medium text-green-600">{lane.matchingLoads} loads</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleToggleEmailAlerts(lane)}
                    >
                      {lane.emailAlerts ? (
                        <>
                          <span className="relative inline-flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                          <span className="text-sm text-gray-600">Email alerts: On</span>
                        </>
                      ) : (
                        <>
                          <span className="relative inline-flex h-3 w-3 mr-2">
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300"></span>
                          </span>
                          <span className="text-sm text-gray-600">Email alerts: Off</span>
                        </>
                      )}
                    </div>
                    <button 
                      className="btn-sm btn-outline-primary"
                      onClick={() => handleViewMatches(lane)}
                      disabled={loading}
                    >
                      View Matches
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Search Modal */}
      <Modal
        isOpen={showSaveSearchModal}
        onClose={() => setShowSaveSearchModal(false)}
        title="Save Search"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button 
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowSaveSearchModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSaveSearchSubmit}
              disabled={loading || !searchName.trim()}
            >
              {loading ? 'Saving...' : 'Save Search'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
            <input 
              type="text" 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="Enter a name for this search"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Search Criteria</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium w-32">Origin:</span>
                <span>{filters.origin || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Destination:</span>
                <span>{filters.destination || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Equipment Type:</span>
                <span>{filters.equipmentType || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Date:</span>
                <span>{filters.date || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Minimum Rate:</span>
                <span>{filters.minRate ? `$${filters.minRate}` : 'Any'}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="text-sm text-blue-800">
                <p>Saving this search will allow you to quickly run it again in the future.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Set Alert Modal */}
      <Modal
        isOpen={showSetAlertModal}
        onClose={() => setShowSetAlertModal(false)}
        title="Set Load Alert"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button 
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowSetAlertModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSetAlertSubmit}
              disabled={loading}
            >
              {loading ? 'Setting Alert...' : 'Set Alert'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Alert Criteria</h4>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium w-32">Origin:</span>
                <span>{filters.origin || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Destination:</span>
                <span>{filters.destination || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Equipment Type:</span>
                <span>{filters.equipmentType || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Date:</span>
                <span>{filters.date || 'Any'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Minimum Rate:</span>
                <span>{filters.minRate ? `$${filters.minRate}` : 'Any'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Frequency</label>
            <select className="block w-full border border-gray-300 rounded-md py-2 px-3">
              <option value="immediately">Immediately</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Method</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="email-notification" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="email-notification" className="ml-2 block text-sm text-gray-700">
                  Email
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="sms-notification" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="sms-notification" className="ml-2 block text-sm text-gray-700">
                  SMS
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="text-sm text-blue-800">
                <p>You will be notified when new loads matching your criteria become available.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Booking"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button 
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowBookingModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        }
      >
        {selectedLoad && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="text-green-600 mr-3">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h4 className="font-medium text-green-800">Ready to Book</h4>
                  <p className="text-sm text-green-700">
                    You're about to book the following load:
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Load Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Load ID:</span>
                  <span className="text-sm font-medium">{selectedLoad.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Route:</span>
                  <span className="text-sm font-medium">{selectedLoad.origin} → {selectedLoad.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Distance:</span>
                  <span className="text-sm font-medium">{selectedLoad.miles} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Equipment:</span>
                  <span className="text-sm font-medium">{selectedLoad.equipmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Rate:</span>
                  <span className="text-sm font-medium">${selectedLoad.rate.toLocaleString()} (${selectedLoad.ratePerMile.toFixed(2)}/mile)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pickup Date:</span>
                  <span className="text-sm font-medium">{selectedLoad.pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Delivery Date:</span>
                  <span className="text-sm font-medium">{selectedLoad.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Broker:</span>
                  <span className="text-sm font-medium">{selectedLoad.broker}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 mr-3">
                  <i className="fas fa-info-circle"></i>
                </div>
                <div className="text-sm text-blue-800">
                  <p>By confirming this booking, you agree to the terms and conditions of the load.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Lane Modal */}
      <Modal
        isOpen={showAddLaneModal}
        onClose={() => setShowAddLaneModal(false)}
        title="Add New Lane"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button 
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowAddLaneModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleAddLaneSubmit}
              disabled={loading || !newLane.origin || !newLane.destination}
            >
              {loading ? 'Adding...' : 'Add Lane'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <input 
              type="text" 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="City, State or Zip Code"
              value={newLane.origin || ''}
              onChange={(e) => setNewLane({...newLane, origin: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input 
              type="text" 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="City, State or Zip Code"
              value={newLane.destination || ''}
              onChange={(e) => setNewLane({...newLane, destination: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
            <select 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              value={newLane.equipmentType || 'Dry Van'}
              onChange={(e) => setNewLane({...newLane, equipmentType: e.target.value})}
            >
              <option value="Dry Van">Dry Van</option>
              <option value="Reefer">Reefer</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Step Deck">Step Deck</option>
              <option value="Lowboy">Lowboy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rate ($)</label>
            <input 
              type="number" 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="0.00"
              value={newLane.minRate || ''}
              onChange={(e) => setNewLane({...newLane, minRate: parseFloat(e.target.value)})}
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="email-alerts" 
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={newLane.emailAlerts || false}
              onChange={(e) => setNewLane({...newLane, emailAlerts: e.target.checked})}
            />
            <label htmlFor="email-alerts" className="ml-2 block text-sm text-gray-700">
              Enable email alerts for this lane
            </label>
          </div>
        </div>
      </Modal>

      {/* Edit Lane Modal */}
      <Modal
        isOpen={showEditLaneModal}
        onClose={() => setShowEditLaneModal(false)}
        title="Edit Lane"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button 
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowEditLaneModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleEditLaneSubmit}
              disabled={loading || !newLane.origin || !newLane.destination}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <input 
              type="text" 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="City, State or Zip Code"
              value={newLane.origin || ''}
              onChange={(e) => setNewLane({...newLane, origin: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input 
              type="text" 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="City, State or Zip Code"
              value={newLane.destination || ''}
              onChange={(e) => setNewLane({...newLane, destination: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
            <select 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              value={newLane.equipmentType || 'Dry Van'}
              onChange={(e) => setNewLane({...newLane, equipmentType: e.target.value})}
            >
              <option value="Dry Van">Dry Van</option>
              <option value="Reefer">Reefer</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Step Deck">Step Deck</option>
              <option value="Lowboy">Lowboy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rate ($)</label>
            <input 
              type="number" 
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="0.00"
              value={newLane.minRate || ''}
              onChange={(e) => setNewLane({...newLane, minRate: parseFloat(e.target.value)})}
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="edit-email-alerts" 
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={newLane.emailAlerts || false}
              onChange={(e) => setNewLane({...newLane, emailAlerts: e.target.checked})}
            />
            <label htmlFor="edit-email-alerts" className="ml-2 block text-sm text-gray-700">
              Enable email alerts for this lane
            </label>
          </div>
        </div>
      </Modal>

      {/* Search Loader */}
      <SearchLoader 
        isSearching={isSearching} 
        onComplete={() => {
          // Completion is handled by the hook
        }} 
      />

      {/* Load Match Modal */}
      <LoadMatchModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        loads={matchedLoads}
        onCallBroker={handleCallBroker}
        onEmailBroker={handleEmailBroker}
        onReject={handleRejectLoad}
        onSaveForLater={handleSaveForLater}
      />

      {/* Broker Call Modal */}
      {selectedMatchedLoad && (
        <BrokerCallModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          brokerName={selectedMatchedLoad.broker.name}
          brokerCompany={selectedMatchedLoad.broker.company}
          brokerPhone={selectedMatchedLoad.broker.phone}
          loadId={selectedMatchedLoad.id}
          onSaveNotes={handleSaveCallNotes}
        />
      )}
    </div>
  );
};

export default SmartLoadSearch;
