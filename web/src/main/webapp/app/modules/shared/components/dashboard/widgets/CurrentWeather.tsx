import React from 'react';
import WeatherWidget from '../../../../../components/WeatherWidget';

interface CurrentWeatherProps {
  lat?: number;
  lon?: number;
  location?: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  lat = 40.4406, 
  lon = -79.9959, 
  location = "Pittsburgh, PA" 
}) => {
  return (
    <section className="mb-6">
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-cloud-sun mr-2 text-blue-600"></i>
        Current Weather
      </h2>
      <WeatherWidget 
        lat={lat}
        lon={lon}
        location={location}
      />
    </section>
  );
};

export default CurrentWeather;