import React from 'react';

interface WeatherWidgetProps {
  id: string;
  title: string;
  props?: Record<string, any>;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ title }) => {
  // Mock weather data - in real app, would fetch from weather API
  const weatherData = {
    temperature: 72,
    condition: 'Partly Cloudy',
    location: 'Chicago, IL',
    icon: '⛅'
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white shadow-lg">
      <h3 className="text-white/80 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">{weatherData.temperature}°F</p>
          <p className="text-sm text-white/70">{weatherData.condition}</p>
          <p className="text-xs text-white/60 mt-1">{weatherData.location}</p>
        </div>
        <div className="text-5xl">{weatherData.icon}</div>
      </div>
    </div>
  );
};