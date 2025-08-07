import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { toast } from 'react-hot-toast';
import MapboxAddressInput from '../components/MapboxAddressInput';
import type { GeocodingFeature } from '@mapbox/search-js-core';
import { jupiterAluminumLocations, commonDestinations } from '../../../data/shipperLocations';
import { ApiClient } from '../../../services/api';

// Define interfaces for type safety
interface Coordinates {
  lat: number;
  lon: number;
}

interface ShipmentFormData {
  originAddress: string;
  destinationAddress: string;
  originCoordinates: Coordinates | null;
  destinationCoordinates: Coordinates | null;
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTimeStart: string;
  deliveryTimeEnd: string;
  commodity: string;
  weight: string;
  pallets: string;
  rate: string;
  equipmentType: string;
  broker: string;
  reference: string;
  specialInstructions: string;
  hazmat: boolean;
  stackable: boolean;
  temperatureControlled: boolean;
  temperature: string;
}

interface ShipmentPayload {
  id?: string;
  loadNumber?: string;
  
  // Origin details
  originAddress: string;
  originCity?: string;
  originState?: string;
  originZip?: string;
  originLat?: number;
  originLng?: number;
  
  // Destination details
  destinationAddress: string;
  destinationCity?: string;
  destinationState?: string;
  destinationZip?: string;
  destinationLat?: number;
  destinationLng?: number;
  
  // Route details
  distance?: number;
  routingType?: string;
  
  // Schedule details
  pickupDate: string;
  pickupTimeStart?: string;
  pickupTimeEnd?: string;
  deliveryDate: string;
  deliveryTimeStart?: string;
  deliveryTimeEnd?: string;
  
  // Cargo details
  commodity: string;
  weight: number;
  pallets?: number;
  
  // Business details
  rate?: number;
  equipmentType: string;
  broker: string;
  brokerId?: string;
  shipperId?: string;
  referenceNumber?: string;
  notes?: string;
  specialInstructions?: string;
  
  // Special requirements
  hazmat: boolean;
  stackable: boolean;
  temperatureControlled: boolean;
  temperature?: string;
  
  // Status and metadata
  status: string;
  createdBy?: string;
  createdAt: string;
  
  // Legacy fields for backward compatibility
  originCoordinates?: Coordinates;
  destinationCoordinates?: Coordinates;
  reference?: string;
}

const CreateLoad: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // List of brokers that shippers work with
  const brokerPartners = [
    'Shanahan Transportation Systems, Inc.',
    'Express Freight Brokers',
    'Midwest Freight Solutions',
    'National Logistics Corp',
    'East Coast Brokers',
    'Regional Transport Services',
    'Northeast Logistics'
  ];
  
  // Map display-friendly equipment types to backend enum values
  const equipmentTypeMap: Record<string, string> = {
    'Dry Van': 'DRY_VAN',
    'Flatbed': 'FLATBED',
    'Reefer': 'REEFER',
    'Step Deck': 'STEP_DECK',
    'RGN': 'RGN',
    'Tanker': 'TANKER',
    'Conestoga': 'BOX_TRUCK', // Mapping Conestoga to closest available enum
    'Power Only': 'POWER_ONLY',
    'Hotshot': 'HOTSHOT',
    'Box Truck': 'BOX_TRUCK',
    'Double Drop': 'DOUBLE_DROP'
  };
  
  // Map display-friendly load status to backend enum values
  const loadStatusMap: Record<string, string> = {
    'Draft': 'DRAFT',
    'New': 'NEW',
    'Active': 'ACTIVE',
    'Assigned': 'ASSIGNED',
    'En Route': 'EN_ROUTE',
    'In Transit': 'IN_TRANSIT',
    'Delivered': 'DELIVERED',
    'Closed': 'CLOSED',
    'Cancelled': 'CANCELLED'
  };
  
  const [formData, setFormData] = useState({
    originAddress: '',
    destinationAddress: '',
    originCoordinates: null as { lat: number; lon: number } | null,
    destinationCoordinates: null as { lat: number; lon: number } | null,
    pickupDate: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    deliveryDate: '',
    deliveryTimeStart: '',
    deliveryTimeEnd: '',
    commodity: '',
    weight: '',
    pallets: '',
    rate: '',
    equipmentType: 'Dry Van',
    broker: 'Shanahan Transportation Systems, Inc.',
    reference: '',
    specialInstructions: '',
    hazmat: false,
    stackable: true,
    temperatureControlled: false,
    temperature: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = (): boolean => {
    // Required fields validation
    if (!formData.originAddress) {
      toast.error('Origin address is required');
      return false;
    }
    if (!formData.destinationAddress) {
      toast.error('Destination address is required');
      return false;
    }
    if (!formData.pickupDate) {
      toast.error('Pickup date is required');
      return false;
    }
    if (!formData.deliveryDate) {
      toast.error('Delivery date is required');
      return false;
    }
    if (!formData.commodity) {
      toast.error('Commodity is required');
      return false;
    }
    if (!formData.weight) {
      toast.error('Weight is required');
      return false;
    }
    if (!formData.equipmentType) {
      toast.error('Equipment type is required');
      return false;
    }
    
    // Validate dates
    const pickup = new Date(formData.pickupDate);
    const delivery = new Date(formData.deliveryDate);
    
    if (isNaN(pickup.getTime())) {
      toast.error('Invalid pickup date');
      return false;
    }
    
    if (isNaN(delivery.getTime())) {
      toast.error('Invalid delivery date');
      return false;
    }
    
    if (pickup > delivery) {
      toast.error('Pickup date cannot be after delivery date');
      return false;
    }
    
    // Validate time ranges
    if ((formData.pickupTimeStart && !formData.pickupTimeEnd) || (!formData.pickupTimeStart && formData.pickupTimeEnd)) {
      toast.error('Both pickup start and end times must be provided');
      return false;
    }
    
    if ((formData.deliveryTimeStart && !formData.deliveryTimeEnd) || (!formData.deliveryTimeStart && formData.deliveryTimeEnd)) {
      toast.error('Both delivery start and end times must be provided');
      return false;
    }
    
    // Check that start time is before end time if both are provided
    if (formData.pickupTimeStart && formData.pickupTimeEnd) {
      if (formData.pickupTimeStart >= formData.pickupTimeEnd) {
        toast.error('Pickup start time must be before pickup end time');
        return false;
      }
    }
    
    if (formData.deliveryTimeStart && formData.deliveryTimeEnd) {
      if (formData.deliveryTimeStart >= formData.deliveryTimeEnd) {
        toast.error('Delivery start time must be before delivery end time');
        return false;
      }
    }
    
    // Validate numeric fields
    if (isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0) {
      toast.error('Weight must be a positive number');
      return false;
    }
    
    if (formData.pallets && (isNaN(parseFloat(formData.pallets)) || parseFloat(formData.pallets) < 0)) {
      toast.error('Pallets must be a non-negative number');
      return false;
    }
    
    if (formData.rate && (isNaN(parseFloat(formData.rate)) || parseFloat(formData.rate) < 0)) {
      toast.error('Rate must be a non-negative number');
      return false;
    }
    
    // Temperature validation for temperature-controlled shipments
    if (formData.temperatureControlled && !formData.temperature) {
      toast.error('Temperature range is required for temperature-controlled shipments');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Extract city, state, zip from addresses
      // This is a simplified approach - in a real implementation, you might use a geocoding service
      const extractAddressComponents = (address: string) => {
        const parts = address.split(',').map(part => part.trim());
        let city = '';
        let state = '';
        let zip = '';
        
        // Very basic extraction - assumes format like "City, State ZIP"
        if (parts.length >= 2) {
          city = parts[0];
          const stateZip = parts[parts.length - 1].split(' ');
          if (stateZip.length >= 2) {
            state = stateZip[0];
            zip = stateZip[stateZip.length - 1];
          }
        }
        
        return { city, state, zip };
      };
      
      const originComponents = extractAddressComponents(formData.originAddress);
      const destinationComponents = extractAddressComponents(formData.destinationAddress);
      
      // Time fields are now directly input as HH:mm format using HTML5 time inputs
      
      // Calculate distance (simplified - in a real implementation, you might use a mapping service)
      let distance = undefined;
      if (formData.originCoordinates && formData.destinationCoordinates) {
        // Simple Haversine formula for distance calculation
        const R = 3958.8; // Earth radius in miles
        const lat1 = formData.originCoordinates.lat * Math.PI / 180;
        const lat2 = formData.destinationCoordinates.lat * Math.PI / 180;
        const deltaLat = (formData.destinationCoordinates.lat - formData.originCoordinates.lat) * Math.PI / 180;
        const deltaLon = (formData.destinationCoordinates.lon - formData.originCoordinates.lon) * Math.PI / 180;
        
        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = Math.round(R * c); // Distance in miles, rounded to nearest integer
      }
      
      // Convert form data to payload format
      const shipmentPayload: ShipmentPayload = {
        // Let the backend generate the load number
        originAddress: formData.originAddress,
        originCity: originComponents.city,
        originState: originComponents.state,
        originZip: originComponents.zip,
        originLat: formData.originCoordinates ? formData.originCoordinates.lat : undefined,
        originLng: formData.originCoordinates ? formData.originCoordinates.lon : undefined,
        
        destinationAddress: formData.destinationAddress,
        destinationCity: destinationComponents.city,
        destinationState: destinationComponents.state,
        destinationZip: destinationComponents.zip,
        destinationLat: formData.destinationCoordinates ? formData.destinationCoordinates.lat : undefined,
        destinationLng: formData.destinationCoordinates ? formData.destinationCoordinates.lon : undefined,
        
        distance: distance,
        
        pickupDate: formData.pickupDate,
        pickupTimeStart: formData.pickupTimeStart || undefined,
        pickupTimeEnd: formData.pickupTimeEnd || undefined,
        
        deliveryDate: formData.deliveryDate,
        deliveryTimeStart: formData.deliveryTimeStart || undefined,
        deliveryTimeEnd: formData.deliveryTimeEnd || undefined,
        
        commodity: formData.commodity,
        weight: parseFloat(formData.weight),
        pallets: formData.pallets ? parseInt(formData.pallets, 10) : undefined,
        rate: formData.rate ? parseFloat(formData.rate) : undefined,
        
        // Convert display-friendly equipment type to backend enum format
        equipmentType: equipmentTypeMap[formData.equipmentType] || formData.equipmentType,
        
        // Set routing type to STANDARD by default
        routingType: 'STANDARD',
        
        // Use broker name for now - in a real implementation, you would look up the broker ID
        brokerId: undefined,
        broker: formData.broker,
        
        // Set shipper ID - in a real implementation, you would get this from the authenticated user
        shipperId: undefined,
        
        referenceNumber: formData.reference || undefined,
        notes: formData.specialInstructions || undefined,
        specialInstructions: formData.specialInstructions || undefined,
        
        hazmat: formData.hazmat,
        stackable: formData.stackable,
        temperatureControlled: formData.temperatureControlled,
        temperature: formData.temperatureControlled ? formData.temperature : undefined,
        
        status: loadStatusMap['Draft'] || 'DRAFT',
        
        // Set created_by - in a real implementation, you would get this from the authenticated user
        createdBy: undefined,
        createdAt: new Date().toISOString()
      };
      
      // Log the payload for debugging
      console.log('Submitting shipment payload:', JSON.stringify(shipmentPayload, null, 2));
      
      // Submit shipment to API
      const response = await ApiClient.post<{ id: string }>('/loads', shipmentPayload);
      
      // Log the response for debugging
      console.log('API response:', response);
      
      // Show success message
      toast.success(`Shipment ${response.id} created successfully!`);
      
      // Navigate to loads page
      navigate('/shipper/loads');
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Shipment</h1>
        <button
          onClick={() => navigate('/shipper/loads')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to Shipments
        </button>
      </div>
      
      <Card className="bg-white shadow-md">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Broker Selection */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <label htmlFor="broker" className="block text-sm font-medium text-gray-700 mb-1">
                Select Broker Partner *
              </label>
              <select
                id="broker"
                name="broker"
                value={formData.broker}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {brokerPartners.map((broker) => (
                  <option key={broker} value={broker}>{broker}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                This shipment will be assigned to the selected broker partner
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Origin Details</h3>
                <MapboxAddressInput
                  label="Origin Address"
                  value={formData.originAddress}
                  onChange={(value) => setFormData({ ...formData, originAddress: value })}
                  onFeatureSelect={(feature: GeocodingFeature) => {
                    if (feature?.geometry?.coordinates) {
                      setFormData({
                        ...formData,
                        originAddress: feature.properties.full_address || formData.originAddress,
                        originCoordinates: {
                          lat: feature.geometry.coordinates[1],
                          lon: feature.geometry.coordinates[0]
                        }
                      });
                    }
                  }}
                  savedLocations={jupiterAluminumLocations}
                  placeholder="Search for address or select from saved locations"
                  required
                />
                
                <div>
                  <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Time Window
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="pickupTimeStart" className="block text-xs text-gray-500 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="pickupTimeStart"
                        name="pickupTimeStart"
                        value={formData.pickupTimeStart}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="pickupTimeEnd" className="block text-xs text-gray-500 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="pickupTimeEnd"
                        name="pickupTimeEnd"
                        value={formData.pickupTimeEnd}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Destination Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Destination Details</h3>
                <MapboxAddressInput
                  label="Destination Address"
                  value={formData.destinationAddress}
                  onChange={(value) => setFormData({ ...formData, destinationAddress: value })}
                  onFeatureSelect={(feature: GeocodingFeature) => {
                    if (feature?.geometry?.coordinates) {
                      setFormData({
                        ...formData,
                        destinationAddress: feature.properties.full_address || formData.destinationAddress,
                        destinationCoordinates: {
                          lat: feature.geometry.coordinates[1],
                          lon: feature.geometry.coordinates[0]
                        }
                      });
                    }
                  }}
                  savedLocations={[...jupiterAluminumLocations, ...commonDestinations]}
                  placeholder="Search for address or select from saved locations"
                  required
                />
                
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Date *
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time Window
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="deliveryTimeStart" className="block text-xs text-gray-500 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="deliveryTimeStart"
                        name="deliveryTimeStart"
                        value={formData.deliveryTimeStart}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="deliveryTimeEnd" className="block text-xs text-gray-500 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="deliveryTimeEnd"
                        name="deliveryTimeEnd"
                        value={formData.deliveryTimeEnd}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cargo Details */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cargo Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="commodity" className="block text-sm font-medium text-gray-700 mb-1">
                    Commodity *
                  </label>
                  <input
                    type="text"
                    id="commodity"
                    name="commodity"
                    value={formData.commodity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Aluminum Coils, Auto Parts"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number / PO Number
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. PO-12345"
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs) *
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 40000"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="pallets" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Pallets
                  </label>
                  <input
                    type="text"
                    id="pallets"
                    name="pallets"
                    value={formData.pallets}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 24"
                  />
                </div>
                
                <div>
                  <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Type *
                  </label>
                  <select
                    id="equipmentType"
                    name="equipmentType"
                    value={formData.equipmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Dry Van">Dry Van</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Reefer">Reefer</option>
                    <option value="Step Deck">Step Deck</option>
                    <option value="RGN">RGN</option>
                    <option value="Tanker">Tanker</option>
                    <option value="Conestoga">Conestoga</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Rate ($)
                  </label>
                  <input
                    type="text"
                    id="rate"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 2500"
                  />
                </div>
              </div>
              
              {/* Special Requirements */}
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-medium text-gray-800">Special Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hazmat"
                      checked={formData.hazmat}
                      onChange={handleInputChange}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm">Hazmat</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="stackable"
                      checked={formData.stackable}
                      onChange={handleInputChange}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm">Stackable</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="temperatureControlled"
                      checked={formData.temperatureControlled}
                      onChange={handleInputChange}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm">Temperature Controlled</span>
                  </label>
                </div>
                
                {formData.temperatureControlled && (
                  <div className="mt-2">
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature Range
                    </label>
                    <input
                      type="text"
                      id="temperature"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 35-40°F"
                    />
                  </div>
                )}
              </div>
              
              {/* Special Instructions */}
              <div className="mt-6">
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special handling instructions, appointment requirements, etc."
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/shipper/loads')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-sm flex items-center ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i> Create Shipment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CreateLoad;