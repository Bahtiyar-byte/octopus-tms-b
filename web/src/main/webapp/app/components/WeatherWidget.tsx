import React, { useState, useEffect, useRef } from 'react';
import { getCurrentWeather, searchCity, CITIES } from '../services/weatherService';

interface WeatherWidgetProps {
  lat: number;
  lon: number;
  location: string;
  className?: string;
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
}

interface CityOption {
  name: string;
  lat: number;
  lon: number;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat: initialLat, lon: initialLon, location: initialLocation, className = '' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState<number>(initialLat);
  const [lon, setLon] = useState<number>(initialLon);
  const [location, setLocation] = useState<string>(initialLocation);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getCurrentWeather(lat, lon, units);

        if (data) {
          setWeather({
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            windSpeed: Math.round(data.wind.speed),
            humidity: data.main.humidity,
            pressure: data.main.pressure
          });
          setError(null);
        } else {
          setError('Unable to fetch weather data');
        }
      } catch (err) {
        setError('Error fetching weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, units]);

  const handleCitySelect = (city: CityOption) => {
    setLat(city.lat);
    setLon(city.lon);
    setLocation(city.name);
    setShowCityDropdown(false);
    setSearchTerm('');
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchCity(searchTerm);
      if (result) {
        handleCitySelect(result);
      } else {
        setError('City not found');
      }
    } catch (err) {
      setError('Error searching for city');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Get weather icon based on condition
  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeatherMap icon codes to Font Awesome icons
    const iconMap: Record<string, string> = {
      '01d': 'fa-sun', // clear sky day
      '01n': 'fa-moon', // clear sky night
      '02d': 'fa-cloud-sun', // few clouds day
      '02n': 'fa-cloud-moon', // few clouds night
      '03d': 'fa-cloud', // scattered clouds
      '03n': 'fa-cloud',
      '04d': 'fa-cloud', // broken clouds
      '04n': 'fa-cloud',
      '09d': 'fa-cloud-showers-heavy', // shower rain
      '09n': 'fa-cloud-showers-heavy',
      '10d': 'fa-cloud-rain', // rain day
      '10n': 'fa-cloud-rain', // rain night
      '11d': 'fa-bolt', // thunderstorm
      '11n': 'fa-bolt',
      '13d': 'fa-snowflake', // snow
      '13n': 'fa-snowflake',
      '50d': 'fa-smog', // mist
      '50n': 'fa-smog'
    };

    return iconMap[iconCode] || 'fa-cloud';
  };

  // Get color based on temperature
  const getTempColor = (temp: number) => {
    if (temp >= 90) return 'text-red-600';
    if (temp >= 80) return 'text-orange-500';
    if (temp >= 70) return 'text-yellow-500';
    if (temp >= 60) return 'text-green-500';
    if (temp >= 40) return 'text-blue-400';
    return 'text-blue-600';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{location}</h3>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Weather data unavailable
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            {location} <i className="fas fa-chevron-down ml-1 text-xs"></i>
          </button>

          {showCityDropdown && (
            <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg py-1 max-h-60 overflow-y-auto">
              <div className="p-2">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search city..."
                    className="flex-grow px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={isSearching || !searchTerm.trim()}
                    className="px-2 py-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {isSearching ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-xs text-gray-500 mb-1">Select a city:</p>
                  {CITIES.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <button 
            onClick={() => setUnits(units === 'imperial' ? 'metric' : 'imperial')}
            className={`text-xs px-2 py-1 rounded-full ${units === 'imperial' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} mr-2`}
          >
            °F
          </button>
          <button 
            onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
            className={`text-xs px-2 py-1 rounded-full ${units === 'metric' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            °C
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center">
        <div className="flex-shrink-0 mr-4">
          <i className={`fas ${getWeatherIcon(weather.icon)} text-4xl ${getTempColor(weather.temp)}`}></i>
        </div>
        <div>
          <div className="flex items-baseline">
            <span className={`text-3xl font-bold ${getTempColor(weather.temp)}`}>
              {weather.temp}°{units === 'imperial' ? 'F' : 'C'}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              Feels like {weather.feelsLike}°{units === 'imperial' ? 'F' : 'C'}
            </span>
          </div>
          <div className="text-sm text-gray-600 capitalize">{weather.description}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
        <div>
          <div className="flex items-center">
            <i className="fas fa-wind mr-1"></i>
            <span>Wind</span>
          </div>
          <div className="font-medium text-gray-700">
            {weather.windSpeed} {units === 'imperial' ? 'mph' : 'm/s'}
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <i className="fas fa-tint mr-1"></i>
            <span>Humidity</span>
          </div>
          <div className="font-medium text-gray-700">{weather.humidity}%</div>
        </div>
        <div>
          <div className="flex items-center">
            <i className="fas fa-compress-alt mr-1"></i>
            <span>Pressure</span>
          </div>
          <div className="font-medium text-gray-700">{weather.pressure} hPa</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
