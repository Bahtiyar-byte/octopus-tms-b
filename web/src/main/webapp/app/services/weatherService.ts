import axios from 'axios';
import { WeatherAlert } from '../types';

// OpenWeatherMap API configuration
const API_KEY = 'b4b18010157af6350c104c59523e8307';
// const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

// Validate API key
if (!API_KEY && import.meta.env.PROD) {
  console.warn('Weather API key not configured. Weather features will be disabled.');
}

// Cities with their coordinates for weather data
const CITIES = [
  {name: 'Pittsburgh, PA', lat: 40.4406, lon: -79.9959 },
  { name: 'Atlanta, GA', lat: 33.7490, lon: -84.3880 },
  { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298 },
  { name: 'Dallas, TX', lat: 32.7767, lon: -96.7970 },
  { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
  { name: 'Miami, FL', lat: 25.7617, lon: -80.1918 },
  { name: 'New York, NY', lat: 40.7128, lon: -74.0060 },
  { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321 },
  { name: 'Houston, TX', lat: 29.7604, lon: -95.3698 },
  { name: 'Phoenix, AZ', lat: 33.4484, lon: -112.0740 },
  { name: 'Denver, CO', lat: 39.7392, lon: -104.9903 }
];

// Function to determine impact level based on weather conditions
const getImpactLevel = (weatherId: number, temp: number, windSpeed: number): 'High' | 'Medium' | 'Low' => {
  // Weather condition codes: https://openweathermap.org/weather-conditions

  // Severe weather (thunderstorms, snow, extreme)
  if (weatherId >= 200 && weatherId < 300 || // Thunderstorm
      weatherId >= 600 && weatherId < 700 || // Snow
      weatherId >= 900 && weatherId < 910) { // Extreme
    return 'High';
  }

  // Moderate weather (rain, fog)
  if (weatherId >= 300 && weatherId < 600 || // Drizzle and Rain
      weatherId >= 700 && weatherId < 800) { // Atmosphere (fog, mist)
    return 'Medium';
  }

  // High winds
  if (windSpeed > 20) {
    return 'High';
  } else if (windSpeed > 10) {
    return 'Medium';
  }

  // Extreme temperatures
  if (temp > 95 || temp < 32) {
    return 'Medium';
  }

  // Default - clear or cloudy with mild conditions
  return 'Low';
};

// Function to generate alert message based on weather conditions
const getAlertMessage = (weatherId: number, description: string, temp: number, windSpeed: number): string => {
  if (weatherId >= 200 && weatherId < 300) {
    return `Thunderstorms: ${description}. Potential for road hazards and delays.`;
  }

  if (weatherId >= 300 && weatherId < 600) {
    return `Rain: ${description}. Reduced visibility and slippery roads.`;
  }

  if (weatherId >= 600 && weatherId < 700) {
    return `Snow: ${description}. Icy conditions and potential road closures.`;
  }

  if (weatherId >= 700 && weatherId < 800) {
    return `${description}. Reduced visibility expected.`;
  }

  if (windSpeed > 20) {
    return `High winds (${Math.round(windSpeed)} mph). Caution advised for high-profile vehicles.`;
  }

  if (temp > 95) {
    return `Extreme heat (${Math.round(temp)}°F). Check refrigerated cargo frequently.`;
  }

  if (temp < 32) {
    return `Freezing temperatures (${Math.round(temp)}°F). Watch for icy roads.`;
  }

  return `${description}. No significant impact on transportation.`;
};

// Function to estimate affected loads based on impact level
const getAffectedLoads = (impact: string): number => {
  switch (impact) {
    case 'High':
      return Math.floor(Math.random() * 5) + 8; // 8-12 loads
    case 'Medium':
      return Math.floor(Math.random() * 5) + 3; // 3-7 loads
    case 'Low':
      return Math.floor(Math.random() * 3); // 0-2 loads
    default:
      return 0;
  }
};

// Main function to fetch weather data and convert to alerts
export const fetchWeatherAlerts = async (): Promise<WeatherAlert[]> => {
  try {
    // Use a fallback if API calls fail or limit is reached
    const useFallback = Math.random() > 0.8; // 20% chance to use fallback for demo purposes

    if (useFallback) {
      return getFallbackWeatherAlerts();
    }

    const alerts: WeatherAlert[] = [];

    // Fetch weather data for each city
    const promises = CITIES.map(city => 
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=imperial`)
    );

    const responses = await Promise.all(promises);

    // Process each response
    responses.forEach((response, index) => {
      const data = response.data;
      const city = CITIES[index].name;
      const weatherId = data.weather[0].id;
      const description = data.weather[0].description;
      const temp = data.main.temp;
      const windSpeed = data.wind.speed;

      const impact = getImpactLevel(weatherId, temp, windSpeed);

      // Only create alerts for medium and high impact weather
      if (impact !== 'Low') {
        const alert: WeatherAlert = {
          region: city,
          alert: getAlertMessage(weatherId, description, temp, windSpeed),
          impact,
          affectedLoads: getAffectedLoads(impact),
          id: '',
          severity: 'info',
          title: '',
          description: ''
        };

        alerts.push(alert);
      }
    });

    return alerts;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching weather data:', error);
    }
    return getFallbackWeatherAlerts();
  }
};

// Fallback weather alerts if API fails
const getFallbackWeatherAlerts = (): WeatherAlert[] => {
  return [
    {
      region: 'Chicago, IL',
      alert: 'Heavy snow. Icy conditions and potential road closures.',
      impact: 'High',
      affectedLoads: 9,
      id: '',
      severity: 'info',
      title: '',
      description: ''
    },
    {
      region: 'Dallas, TX',
      alert: 'Thunderstorms with heavy rain. Potential for road hazards and delays.',
      impact: 'Medium',
      affectedLoads: 5,
      id: '',
      severity: 'info',
      title: '',
      description: ''
    },
    {
      region: 'Miami, FL',
      alert: 'High winds (22 mph). Caution advised for high-profile vehicles.',
      impact: 'Medium',
      affectedLoads: 4,
      id: '',
      severity: 'info',
      title: '',
      description: ''
    }
  ];
};

// Function to get current weather for a specific location
export const getCurrentWeather = async (lat: number, lon: number, units: 'imperial' | 'metric' = 'imperial') => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    );
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching current weather:', error);
    }
    return null;
  }
};

// Function to search for a city by name
export const searchCity = async (cityName: string) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
    );
    return {
      name: response.data.name + (response.data.sys.country ? `, ${response.data.sys.country}` : ''),
      lat: response.data.coord.lat,
      lon: response.data.coord.lon,
      data: response.data
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error searching for city:', error);
    }
    return null;
  }
};

// Export the list of predefined cities
export { CITIES };
