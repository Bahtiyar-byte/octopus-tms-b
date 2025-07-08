import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components';
import { toast } from 'react-hot-toast';
import MapboxAddressInput from '../components/MapboxAddressInput';
import type { GeocodingFeature } from '@mapbox/search-js-core';
import { jupiterAluminumLocations, commonDestinations } from '../../../data/shipperLocations';

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
  
  const [formData, setFormData] = useState({
    originAddress: '',
    destinationAddress: '',
    originCoordinates: null as { lat: number; lon: number } | null,
    destinationCoordinates: null as { lat: number; lon: number } | null,
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new shipment object with form data
      const newShipment = {
        id: `SH-${Math.floor(2000 + Math.random() * 9000)}`,
        ...formData,
        status: 'Draft',
        createdAt: new Date().toISOString()
      };
      
      // Show success message
      toast.success(`Shipment ${newShipment.id} created successfully!`);
      
      // Navigate to loads page
      navigate('/shipper/loads');
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment. Please try again.');
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
                  <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Time Window
                  </label>
                  <input
                    type="text"
                    id="pickupTime"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 8:00 AM - 5:00 PM"
                  />
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
                  <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time Window
                  </label>
                  <input
                    type="text"
                    id="deliveryTime"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 8:00 AM - 5:00 PM"
                  />
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