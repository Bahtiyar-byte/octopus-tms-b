import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Building2, Star, Clock, Search } from 'lucide-react';

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'facility' | 'warehouse' | 'customer';
  isDefault?: boolean;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  savedLocations?: SavedLocation[];
  onSelectSavedLocation?: (location: SavedLocation) => void;
  label?: string;
  required?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter address or select from saved locations",
  savedLocations = [],
  onSelectSavedLocation,
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Mock address suggestions - in real implementation, this would call Google Places API
  const mockAddressSuggestions = [
    "123 Main Street, Chicago, IL 60601",
    "456 Oak Avenue, Detroit, MI 48201", 
    "789 Elm Street, Milwaukee, WI 53201",
    "321 Pine Road, Cleveland, OH 44101",
    "654 Maple Drive, Indianapolis, IN 46201",
    "987 Cedar Lane, Columbus, OH 43215",
    "147 Birch Way, Louisville, KY 40201",
    "258 Walnut Street, Cincinnati, OH 45202"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
    setShowSaved(false);

    // Simulate address search
    if (newValue.length > 2) {
      const filtered = mockAddressSuggestions.filter(addr =>
        addr.toLowerCase().includes(newValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
      setShowSaved(true);
    }
  };

  const handleSelectAddress = (address: string) => {
    setSearchTerm(address);
    onChange(address);
    setIsOpen(false);
  };

  const handleSelectSavedLocation = (location: SavedLocation) => {
    const fullAddress = `${location.name} - ${location.address}`;
    setSearchTerm(fullAddress);
    onChange(location.address);
    onSelectSavedLocation?.(location);
    setIsOpen(false);
  };

  const filteredSavedLocations = savedLocations.filter(loc =>
    searchTerm === '' || 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required={required}
        />
        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {/* Saved Locations Section */}
          {showSaved && filteredSavedLocations.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">Saved Locations</p>
              {filteredSavedLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectSavedLocation(location)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-start gap-3 group"
                >
                  <div className="mt-0.5">
                    {location.type === 'facility' && <Building2 className="w-5 h-5 text-blue-500" />}
                    {location.type === 'warehouse' && <Building2 className="w-5 h-5 text-green-500" />}
                    {location.type === 'customer' && <Star className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                      {location.name}
                      {location.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Address Suggestions Section */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 uppercase px-2 py-1 flex items-center gap-1">
                <Search className="w-3 h-3" />
                Search Results
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAddress(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-3 group"
                >
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-700 group-hover:text-gray-900">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recently Used Section */}
          {showSaved && searchTerm === '' && (
            <div className="p-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase px-2 py-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Recently Used
              </p>
              <button
                onClick={() => handleSelectAddress("8963 River Road, Beech Bottom, WV 26030")}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-3 group"
              >
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                <span className="text-gray-700 group-hover:text-gray-900">
                  8963 River Road, Beech Bottom, WV 26030
                </span>
              </button>
              <button
                onClick={() => handleSelectAddress("1745 - 165th Street, Hammond, IN 46320")}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-3 group"
              >
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                <span className="text-gray-700 group-hover:text-gray-900">
                  1745 - 165th Street, Hammond, IN 46320
                </span>
              </button>
            </div>
          )}

          {/* No Results */}
          {!showSaved && suggestions.length === 0 && searchTerm.length > 2 && (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No addresses found for "{searchTerm}"</p>
              <p className="text-xs mt-1">Try entering a different address</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;