import React from 'react';
import Card from '../ui/Card';
import { WeatherAlert } from '../../types';

interface WeatherAlertsProps {
  weatherAlerts: WeatherAlert[];
  onViewAffectedLoads?: (alert: WeatherAlert) => void;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({
  weatherAlerts,
  onViewAffectedLoads
}) => {
  const getImpactClass = (impact: string) => {
    if (impact === 'High') return 'bg-red-50 border-red-400 text-red-800';
    if (impact === 'Medium') return 'bg-yellow-50 border-yellow-400 text-yellow-800';
    return 'bg-blue-50 border-blue-400 text-blue-800';
  };

  const getImpactIcon = (impact: string) => {
    if (impact === 'High') return 'fa-exclamation-triangle';
    if (impact === 'Medium') return 'fa-exclamation-circle';
    return 'fa-info-circle';
  };

  const handleViewAffectedLoads = (weatherAlert: WeatherAlert) => {
    if (onViewAffectedLoads) {
      onViewAffectedLoads(weatherAlert);
    } else {
      alert(`Weather Alert Details:\n\nRegion: ${weatherAlert.region}\nAlert: ${weatherAlert.alert}\nImpact Level: ${weatherAlert.impact}\nAffected Loads: ${weatherAlert.affectedLoads}\n\nThis would typically show a list of affected loads and their current status.`);
    }
  };

  return (
    <section className="mb-6">
      <h2 className="flex items-center text-xl font-semibold mb-4">
        <i className="fas fa-cloud-sun-rain mr-2 text-blue-600"></i>
        Weather Alerts
      </h2>
      <Card>
        <div className="space-y-3 p-4">
          {weatherAlerts.map((weatherAlert, index) => {
            const impactClass = getImpactClass(weatherAlert.impact || '');
            const impactIcon = getImpactIcon(weatherAlert.impact || '');

            return (
              <div key={index} className={`${impactClass} border-l-4 p-4 rounded-md`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className={`fas ${impactIcon}`}></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">
                      <span className="font-bold">{weatherAlert.region}:</span> {weatherAlert.alert}
                    </h3>
                    <div className="mt-1 text-xs">
                      <span className="font-semibold">Impact: </span>{weatherAlert.impact}
                      <span className="mx-1">&bull;</span>
                      <span className="font-semibold">Loads Affected: </span>{weatherAlert.affectedLoads}
                    </div>
                    <div className="mt-2">
                      <button 
                        onClick={() => handleViewAffectedLoads(weatherAlert)}
                        className="text-xs font-medium underline hover:no-underline"
                      >
                        View Affected Loads
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
};