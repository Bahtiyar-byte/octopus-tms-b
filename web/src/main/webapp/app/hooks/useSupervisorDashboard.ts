import { useState, useEffect } from 'react';
import { DriverPerformance, LoadActivity, WeatherAlert } from '../types';
import { api } from '../services';
import { generateKPIs, type SupervisorKPI } from '../data/kpis';
import { generateFieldOperations, type FieldOperation } from '../data/operations';
import { generateSystemAlerts, getWeatherAlerts, type SystemAlert } from '../data/alerts';
import { generateTeamWorkload, type TeamWorkload } from '../data/teamWorkLoad';
import { generateDriverPerformance } from '../data/drivers';

export const useSupervisorDashboard = (activePeriod: string) => {
  const [kpis, setKpis] = useState<SupervisorKPI[]>([]);
  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([]);
  const [recentActivity, setRecentActivity] = useState<LoadActivity[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [fieldOperations, setFieldOperations] = useState<FieldOperation[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [teamWorkload, setTeamWorkload] = useState<TeamWorkload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch the relevant data from our mock API for some data
        const dashboardData = await api.getDashboardData();
        
        // Generate data using our data functions
        const generatedKPIs = generateKPIs(activePeriod);
        const generatedDriverPerformance = generateDriverPerformance(activePeriod);
        const generatedFieldOperations = generateFieldOperations(activePeriod);
        const generatedSystemAlerts = generateSystemAlerts(activePeriod);
        const generatedTeamWorkload = generateTeamWorkload(activePeriod);
        const generatedWeatherAlerts = getWeatherAlerts();

        // Set all the data
        setKpis(generatedKPIs);
        setDriverPerformance(generatedDriverPerformance);
        setRecentActivity(dashboardData.recentActivity); // Keep using API data for recent activity
        setWeatherAlerts(generatedWeatherAlerts);
        setFieldOperations(generatedFieldOperations);
        setSystemAlerts(generatedSystemAlerts);
        setTeamWorkload(generatedTeamWorkload);
      } catch (error) {
        console.error('Error fetching supervisor dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [activePeriod]);

  const handleResolveAlert = (alertId: string) => {
    setSystemAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const handleFieldOperationAction = (operationId: string, action: string) => {
    // Action taken on operation
    // In a real app, this would call an API endpoint

    // Update the status for the UI
    setFieldOperations(prevOps =>
      prevOps.map(op =>
        op.id === operationId ? { ...op, status: 'In Progress' } : op
      )
    );
  };

  return {
    kpis,
    driverPerformance,
    recentActivity,
    weatherAlerts,
    fieldOperations,
    systemAlerts,
    teamWorkload,
    loading,
    handleResolveAlert,
    handleFieldOperationAction
  };
};