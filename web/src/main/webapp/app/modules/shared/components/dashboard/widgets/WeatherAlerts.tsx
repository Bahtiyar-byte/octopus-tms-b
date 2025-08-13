import React, { useEffect, useState } from 'react';
import { Card } from '../../../../../components';
import { fetchWeatherAlerts } from '../../../../../services/weatherService';
import type { WeatherAlert } from '../../../../../types';

const WeatherAlerts: React.FC = () => {
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  useEffect(() => {
    const getWeatherAlerts = async () => {
      try {
        setWeatherLoading(true);
        const alerts = await fetchWeatherAlerts();
        setWeatherAlerts(alerts);
      } catch (error) {
      } finally {
        setWeatherLoading(false);
      }
    };

    getWeatherAlerts();

    // Refresh weather data every 30 minutes
    const intervalId = setInterval(getWeatherAlerts, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section>
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-cloud-sun-rain mr-2 text-blue-600"></i>
        Weather Alerts
      </h2>
      <Card>
        {weatherLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : weatherAlerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <i className="fas fa-sun text-yellow-400 text-3xl mb-2"></i>
            <p>No weather alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {weatherAlerts.map((alert, index) => {
              const impactClass = alert.impact === 'High' 
                ? 'bg-red-50 border-red-400 text-red-800' 
                : alert.impact === 'Medium' 
                  ? 'bg-yellow-50 border-yellow-400 text-yellow-800' 
                  : 'bg-blue-50 border-blue-400 text-blue-800';

              const impactIcon = alert.impact === 'High' 
                ? 'fa-exclamation-triangle' 
                : alert.impact === 'Medium' 
                  ? 'fa-exclamation-circle' 
                  : 'fa-info-circle';

              return (
                <div key={index} className={`${impactClass} border-l-4 p-4 rounded-md`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className={`fas ${impactIcon}`}></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">
                        <span className="font-bold">{alert.region}:</span> {alert.alert}
                      </h3>
                      <div className="mt-1 text-xs">
                        <span className="font-semibold">Impact: </span>{alert.impact}
                        <span className="mx-1">&bull;</span>
                        <span className="font-semibold">Loads Affected: </span>{alert.affectedLoads}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="text-xs text-gray-500 text-right mt-2">
              <i className="fas fa-sync-alt mr-1"></i> Weather data refreshes every 30 minutes
            </div>
          </div>
        )}
      </Card>
    </section>
  );
};

export default WeatherAlerts;