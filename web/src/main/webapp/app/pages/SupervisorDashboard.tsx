import React, { useState, useEffect } from 'react';
import { Card, Modal } from '../components';
import { DriverPerformance, LoadActivity, WeatherAlert } from '../types';
import { api } from '../services';
import { generateKPIs, type SupervisorKPI } from '../data/kpis';
import { generateFieldOperations, type FieldOperation } from '../data/operations';
import { generateSystemAlerts, getWeatherAlerts, type SystemAlert } from '../data/alerts';
import { generateTeamWorkload, type TeamWorkload } from '../data/teamWorkLoad';
import { generateDriverPerformance } from '../data/drivers';


const SupervisorDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<SupervisorKPI[]>([]);
  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([]);
  const [recentActivity, setRecentActivity] = useState<LoadActivity[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [fieldOperations, setFieldOperations] = useState<FieldOperation[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [teamWorkload, setTeamWorkload] = useState<TeamWorkload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [activePeriod, setActivePeriod] = useState('day');
  const [viewType, setViewType] = useState('grid');
  
  // Driver performance filters and search
  const [driverFilter, setDriverFilter] = useState('all');
  const [driverSearchTerm, setDriverSearchTerm] = useState('');

  // Modal states for Quick Actions
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showCustomerOutreachModal, setShowCustomerOutreachModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showTeamSettingsModal, setShowTeamSettingsModal] = useState(false);

  // Form states for modals
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState('normal');
  const [announcementRecipients, setAnnouncementRecipients] = useState<string[]>([]);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerSubject, setCustomerSubject] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');

  const [reportType, setReportType] = useState('performance');
  const [reportPeriod, setReportPeriod] = useState('week');
  const [reportFormat, setReportFormat] = useState('pdf');

  // Fetch supervisor dashboard data based on selected period
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
  }, [activePeriod]); // Re-fetch when activePeriod changes

  // Handler for resolving system alerts
  const handleResolveAlert = (alertId: string) => {
    setSystemAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  // Handler for taking action on field operations
  const handleFieldOperationAction = (operationId: string, action: string) => {
    console.log(`Action ${action} taken on operation ${operationId}`);
    // In a real app, this would call an API endpoint

    // Update the status for the UI
    setFieldOperations(prevOps =>
      prevOps.map(op =>
        op.id === operationId ? { ...op, status: 'In Progress' } : op
      )
    );
  };

  // Handler for sending team announcement
  const handleSendAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementMessage.trim()) {
      alert('⚠️ Please fill in all required fields:\n• Announcement Title\n• Message Content');
      return;
    }

    // In a real app, this would call an API endpoint
    console.log('Sending announcement:', {
      title: announcementTitle,
      message: announcementMessage,
      priority: announcementPriority,
      recipients: announcementRecipients.length ? announcementRecipients : 'All Team Members'
    });

    // Show success message with details
    const recipients = announcementRecipients.length > 0 
      ? announcementRecipients.join(', ') 
      : 'All Team Members';
    alert(`✅ Announcement Sent Successfully!\n\nTitle: "${announcementTitle}"\nPriority: ${announcementPriority.toUpperCase()}\nRecipients: ${recipients}\n\nYour team will be notified via their preferred notification channels.`);

    // Reset form and close modal
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setAnnouncementPriority('normal');
    setAnnouncementRecipients([]);
    setShowAnnouncementModal(false);
  };

  // Handler for sending customer outreach
  const handleSendCustomerOutreach = () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerSubject.trim() || !customerMessage.trim()) {
      alert('⚠️ Please fill in all required fields:\n• Customer Name\n• Email Address\n• Subject\n• Message Content');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      alert('⚠️ Please enter a valid email address.');
      return;
    }

    // In a real app, this would call an API endpoint
    console.log('Sending customer outreach:', {
      name: customerName,
      email: customerEmail,
      subject: customerSubject,
      message: customerMessage
    });

    // Show success message
    alert(`✅ Customer Outreach Sent Successfully!\n\nTo: ${customerName} (${customerEmail})\nSubject: "${customerSubject}"\n\nThe message has been sent from your company email and a copy has been saved to your outreach log.`);

    // Reset form and close modal
    setCustomerName('');
    setCustomerEmail('');
    setCustomerSubject('');
    setCustomerMessage('');
    setShowCustomerOutreachModal(false);
  };

  // Handler for generating reports
  const handleGenerateReport = () => {
    // In a real app, this would call an API endpoint
    console.log('Generating report:', {
      type: reportType,
      period: reportPeriod,
      format: reportFormat
    });

    // Show processing message with timeout
    alert(`🔄 Report Generation Started\n\nReport Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}\nTime Period: ${reportPeriod}\nFormat: ${reportFormat.toUpperCase()}\n\nProcessing... You'll receive an email notification when the report is ready for download.`);

    // Simulate processing time and show completion
    setTimeout(() => {
      alert(`✅ Report Generated Successfully!\n\n${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for ${reportPeriod} has been generated in ${reportFormat.toUpperCase()} format.\n\nThe report has been saved to your reports folder and emailed to your account.`);
    }, 2000);

    // Close modal
    setShowReportsModal(false);
  };

  // Handler for saving team settings
  const handleSaveTeamSettings = () => {
    // In a real app, this would call an API endpoint
    console.log('Saving team settings');

    // Show success message
    alert(`✅ Team Settings Saved Successfully!\n\nAll notification preferences, dashboard settings, and access controls have been updated.\n\nChanges will take effect immediately for all team members.`);

    // Close modal
    setShowTeamSettingsModal(false);
  };

  // Handler for driver actions
  const handleDriverAction = (driverName: string, action: string) => {
    console.log(`Action ${action} for driver ${driverName}`);
    
    if (action === 'view') {
      alert(`Viewing detailed performance for ${driverName}\n\nThis would open a detailed driver profile page.`);
    } else if (action === 'message') {
      const message = window.prompt(`Send message to ${driverName}:`, '');
      if (message) {
        alert(`Message sent to ${driverName}: "${message}"`);
      }
    } else if (action === 'assign') {
      const loadId = window.prompt('Enter Load ID to assign:', 'LOAD-' + Math.floor(Math.random() * 1000));
      if (loadId) {
        alert(`Load ${loadId} assigned to ${driverName}`);
      }
    }
  };

  // Handler for batch driver actions
  const handleBatchDriverAction = (action: string) => {
    if (selectedDrivers.length === 0) {
      alert('Please select at least one driver first.');
      return;
    }

    if (action === 'message') {
      const message = window.prompt(`Send message to ${selectedDrivers.length} drivers:`, '');
      if (message) {
        alert(`Message sent to ${selectedDrivers.length} drivers: "${message}"`);
        setSelectedDrivers([]);
      }
    } else if (action === 'training') {
      const trainingType = window.prompt('Enter training type:', 'Safety Refresher');
      if (trainingType) {
        alert(`${trainingType} training assigned to ${selectedDrivers.length} drivers`);
        setSelectedDrivers([]);
      }
    } else if (action === 'batch') {
      alert(`Batch actions menu would open for ${selectedDrivers.length} selected drivers`);
    }
  };

  // Filter drivers based on search and filter criteria
  const filteredDrivers = driverPerformance.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase());
    
    if (driverFilter === 'all') return matchesSearch;
    
    const performanceScore = Math.round((driver.rating / 5) * 0.5 * 100 + driver.onTime * 0.5);
    
    if (driverFilter === 'top') return matchesSearch && performanceScore >= 90;
    if (driverFilter === 'attention') return matchesSearch && performanceScore < 75;
    
    return matchesSearch;
  });

  // Helper to format percentage changes
  const formatChange = (change: number) => {
    return change > 0 
      ? <span className="text-green-600">+{change}%</span>
      : change < 0 
        ? <span className="text-red-600">{change}%</span>
        : <span className="text-gray-600">0%</span>;
  };

  // Conditional formatter for performance scores
  const getPerformanceClass = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center my-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of operations, team performance, and business metrics</p>
        </div>

        {/* View Controls */}
        <div className="flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setActivePeriod('day')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activePeriod === 'day' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setActivePeriod('week')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                activePeriod === 'week' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setActivePeriod('month')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                activePeriod === 'month' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              Month
            </button>
          </div>

          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewType('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                viewType === 'grid' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              type="button"
              onClick={() => setViewType('detail')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                viewType === 'detail' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
              title="Detail View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              // Simulate export functionality
              const exportType = window.confirm('📊 Export Dashboard Data\n\nChoose format:\n• OK for PDF (Formatted Report)\n• Cancel for Excel (Data Spreadsheet)') ? 'PDF' : 'Excel';
              alert(`🔄 Exporting dashboard data as ${exportType}...\n\nIncluding:\n• KPI Metrics (${activePeriod})\n• Team Performance Data\n• System Alerts Summary\n• Field Operations Log\n\n✅ Export completed! File saved to Downloads folder.`);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i className="fas fa-download mr-2"></i>
            Export
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <section className="mb-8">
        <h2 className="flex items-center text-xl font-semibold mb-4">
          <i className="fas fa-tachometer-alt mr-2 text-blue-600"></i>
          Key Performance Indicators
          <span className="ml-2 text-sm text-gray-500 font-normal">
            View: {viewType === 'grid' ? 'Grid' : 'Detail'}
          </span>
        </h2>

        {viewType === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{kpi.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                      <p className="text-sm mt-1">
                        vs last period: {formatChange(kpi.change)}
                      </p>
                    </div>
                    <div className={`bg-${kpi.color}-100 p-3 rounded-full`}>
                      <i className={`${kpi.icon} text-${kpi.color}-500 text-xl`}></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${kpi.color}-500 rounded-full`} 
                        style={{ width: typeof kpi.value === 'string' && kpi.value.includes('%') 
                          ? kpi.value 
                          : '75%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Detail View
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kpis.map((kpi, index) => {
                    // Determine status based on change
                    const status = kpi.change > 0 
                      ? 'Improving' 
                      : kpi.change < 0 
                        ? 'Declining' 
                        : 'Stable';

                    // Determine status color
                    const statusColor = kpi.change > 0 
                      ? 'text-green-600' 
                      : kpi.change < 0 
                        ? 'text-red-600' 
                        : 'text-gray-600';

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-${kpi.color}-100 flex items-center justify-center mr-3`}>
                              <i className={`${kpi.icon} text-${kpi.color}-500`}></i>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{kpi.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold">{kpi.value}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{formatChange(kpi.change)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-${kpi.color}-500 rounded-full`} 
                              style={{ width: typeof kpi.value === 'string' && kpi.value.includes('%') 
                                ? kpi.value 
                                : '75%' 
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor} bg-opacity-10`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Team Workload */}
        <div className="lg:col-span-2">
          <section className="mb-6">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-users-cog mr-2 text-blue-600"></i>
              Team Workload & Utilization
            </h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Loads</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Tasks</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamWorkload.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                              {member.member.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{member.member}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.activeLoads}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.pendingTasks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.lastActive}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`${
                                member.utilization > 85 ? 'bg-green-500' :
                                member.utilization > 70 ? 'bg-yellow-500' : 'bg-red-500'
                              } h-2.5 rounded-full`}
                              style={{ width: `${member.utilization}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 text-right">{member.utilization}%</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* Driver Performance */}
          <section className="mb-6">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-truck-moving mr-2 text-blue-600"></i>
              Driver Performance
            </h2>
            <Card>
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setDriverFilter('all')}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        driverFilter === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      All Drivers
                    </button>
                    <button 
                      onClick={() => setDriverFilter('top')}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        driverFilter === 'top' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Top Performers
                    </button>
                    <button 
                      onClick={() => setDriverFilter('attention')}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        driverFilter === 'attention' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Needs Attention
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Search drivers..."
                      value={driverSearchTerm}
                      onChange={(e) => setDriverSearchTerm(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDrivers(filteredDrivers.map(d => d.name));
                              } else {
                                setSelectedDrivers([]);
                              }
                            }}
                          />
                          <span className="ml-2">Driver</span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miles</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time %</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDrivers.map((driver, index) => {
                      const performanceScore = Math.round((driver.rating / 5) * 0.5 * 100 + driver.onTime * 0.5);
                      const performanceClass = getPerformanceClass(performanceScore);
                      const isSelected = selectedDrivers.includes(driver.name);

                      return (
                        <tr key={index} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDrivers([...selectedDrivers, driver.name]);
                                  } else {
                                    setSelectedDrivers(selectedDrivers.filter(name => name !== driver.name));
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="h-8 w-8 ml-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                                {driver.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.miles.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.deliveries}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-2">{driver.rating.toFixed(1)}</span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                      fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.onTime}%</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`${performanceClass} h-2.5 rounded-full transition-all duration-500`}
                                style={{ width: `${performanceScore}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1 text-right">{performanceScore}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleDriverAction(driver.name, 'view')}
                                className="text-blue-600 hover:text-blue-800" 
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                onClick={() => handleDriverAction(driver.name, 'message')}
                                className="text-green-600 hover:text-green-800" 
                                title="Message"
                              >
                                <i className="fas fa-comment"></i>
                              </button>
                              <button 
                                onClick={() => handleDriverAction(driver.name, 'assign')}
                                className="text-purple-600 hover:text-purple-800" 
                                title="Assign Load"
                              >
                                <i className="fas fa-truck-loading"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {selectedDrivers.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      <b>{selectedDrivers.length}</b> drivers selected
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleBatchDriverAction('message')}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <i className="fas fa-envelope mr-1"></i> Message All
                      </button>
                      <button 
                        onClick={() => handleBatchDriverAction('training')}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
                      >
                        <i className="fas fa-certificate mr-1"></i> Assign Training
                      </button>
                      <button 
                        onClick={() => handleBatchDriverAction('batch')}
                        className="px-3 py-1 text-xs font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
                      >
                        <i className="fas fa-cog mr-1"></i> Batch Actions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>

        <div className="lg:col-span-1">
          {/* System Alerts */}
          <section className="mb-6">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-bell mr-2 text-blue-600"></i>
              System Alerts
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                {systemAlerts.filter(a => !a.resolved).length}
              </span>
            </h2>
            <Card>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Active Alerts</h3>
                  <button 
                    onClick={() => alert('Alert History\n\nThis would show a comprehensive history of all system alerts, including resolved and archived alerts with filtering and search capabilities.')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View History
                  </button>
                </div>
              </div>
              <ul className="divide-y divide-gray-200">
                {systemAlerts.map((systemAlert, index) => (
                  <li key={index} className={`p-4 hover:bg-gray-50 ${systemAlert.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {systemAlert.type === 'error' ? (
                          <i className="fas fa-exclamation-circle text-red-500"></i>
                        ) : systemAlert.type === 'warning' ? (
                          <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                        ) : (
                          <i className="fas fa-info-circle text-blue-500"></i>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{systemAlert.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(systemAlert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{systemAlert.message}</p>

                        {!systemAlert.resolved && (
                          <div className="mt-2 flex space-x-2">
                            <button 
                              onClick={() => handleResolveAlert(systemAlert.id)}
                              className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              Mark Resolved
                            </button>
                            <button 
                              onClick={() => alert(`Alert Details: ${systemAlert.title}\n\n${systemAlert.message}\n\nTimestamp: ${new Date(systemAlert.timestamp).toLocaleString()}\nType: ${systemAlert.type.toUpperCase()}`)}
                              className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              View Details
                            </button>
                          </div>
                        )}

                        {systemAlert.resolved && (
                          <span className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Weather Alerts */}
          <section className="mb-6">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-cloud-sun-rain mr-2 text-blue-600"></i>
              Weather Alerts
            </h2>
            <Card>
              <div className="space-y-3 p-4">
                {weatherAlerts.map((weatherAlert, index) => {
                  const impactClass = weatherAlert.impact === 'High' 
                    ? 'bg-red-50 border-red-400 text-red-800' 
                    : weatherAlert.impact === 'Medium' 
                      ? 'bg-yellow-50 border-yellow-400 text-yellow-800' 
                      : 'bg-blue-50 border-blue-400 text-blue-800';

                  const impactIcon = weatherAlert.impact === 'High' 
                    ? 'fa-exclamation-triangle' 
                    : weatherAlert.impact === 'Medium' 
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
                            <span className="font-bold">{weatherAlert.region}:</span> {weatherAlert.alert}
                          </h3>
                          <div className="mt-1 text-xs">
                            <span className="font-semibold">Impact: </span>{weatherAlert.impact}
                            <span className="mx-1">&bull;</span>
                            <span className="font-semibold">Loads Affected: </span>{weatherAlert.affectedLoads}
                          </div>
                          <div className="mt-2">
                            <button 
                              onClick={() => alert(`Weather Alert Details:\n\nRegion: ${weatherAlert.region}\nAlert: ${weatherAlert.alert}\nImpact Level: ${weatherAlert.impact}\nAffected Loads: ${weatherAlert.affectedLoads}\n\nThis would typically show a list of affected loads and their current status.`)}
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

          {/* Quick Actions */}
          <section className="mb-6">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <i className="fas fa-bolt mr-2 text-blue-600"></i>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowAnnouncementModal(true)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors text-center"
              >
                <i className="fas fa-bullhorn text-blue-500 text-2xl mb-2"></i>
                <span className="text-sm font-medium">Team Announcement</span>
              </button>
              <button 
                onClick={() => setShowCustomerOutreachModal(true)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors text-center"
              >
                <i className="fas fa-headset text-blue-500 text-2xl mb-2"></i>
                <span className="text-sm font-medium">Customer Outreach</span>
              </button>
              <button 
                onClick={() => setShowReportsModal(true)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors text-center"
              >
                <i className="fas fa-file-alt text-blue-500 text-2xl mb-2"></i>
                <span className="text-sm font-medium">Generate Reports</span>
              </button>
              <button 
                onClick={() => setShowTeamSettingsModal(true)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors text-center"
              >
                <i className="fas fa-cogs text-blue-500 text-2xl mb-2"></i>
                <span className="text-sm font-medium">Team Settings</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Field Operations */}
      <section className="mb-8">
        <h2 className="flex items-center text-xl font-semibold mb-4">
          <i className="fas fa-clipboard-list mr-2 text-blue-600"></i>
          Field Operations
        </h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fieldOperations.map((op, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {op.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(op.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.driver}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{op.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${op.status === 'Requires Attention' 
                          ? 'bg-red-100 text-red-800'
                          : op.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : op.status === 'Resolved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${op.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : op.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                        {op.priority.charAt(0).toUpperCase() + op.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFieldOperationAction(op.id, 'approve')} 
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          onClick={() => handleFieldOperationAction(op.id, 'assign')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Assign"
                        >
                          <i className="fas fa-user-plus"></i>
                        </button>
                        <button 
                          className="text-purple-600 hover:text-purple-900"
                          title="Details"
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">5</span> of <span className="font-medium">24</span> operations
            </span>
            <nav className="flex space-x-2" aria-label="Pagination">
              <a
                href="#"
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md"
              >
                1
              </a>
              <a
                href="#"
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                2
              </a>
              <a
                href="#"
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </a>
            </nav>
          </div>
        </Card>
      </section>

      {/* Team Announcement Modal */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title="Send Team Announcement"
        size="lg"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAnnouncementModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendAnnouncement}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Send Announcement
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Title *
            </label>
            <input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Enter announcement title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="Enter your announcement message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              value={announcementPriority}
              onChange={(e) => setAnnouncementPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="all-team"
                  checked={announcementRecipients.length === 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAnnouncementRecipients([]);
                    }
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="all-team" className="ml-2 text-sm text-gray-700">
                  All Team Members (Default)
                </label>
              </div>
              {['Dispatchers', 'Drivers', 'Customer Service', 'Operations'].map((group) => (
                <div key={group} className="flex items-center">
                  <input
                    type="checkbox"
                    id={group.toLowerCase()}
                    checked={announcementRecipients.includes(group)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAnnouncementRecipients([...announcementRecipients, group]);
                      } else {
                        setAnnouncementRecipients(announcementRecipients.filter(r => r !== group));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={group.toLowerCase()} className="ml-2 text-sm text-gray-700">
                    {group} Only
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Customer Outreach Modal */}
      <Modal
        isOpen={showCustomerOutreachModal}
        onClose={() => setShowCustomerOutreachModal(false)}
        title="Send Customer Outreach"
        size="lg"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCustomerOutreachModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendCustomerOutreach}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Send Message
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={customerSubject}
              onChange={(e) => setCustomerSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Enter your message to the customer..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-info-circle text-blue-400"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Professional Communication
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  This message will be sent from the company email with your supervisor signature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Generate Reports Modal */}
      <Modal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        title="Generate Reports"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowReportsModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateReport}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="performance">Team Performance Report</option>
              <option value="financial">Financial Summary Report</option>
              <option value="operational">Operational Metrics Report</option>
              <option value="customer">Customer Satisfaction Report</option>
              <option value="driver">Driver Analytics Report</option>
              <option value="compliance">Compliance & Safety Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="space-y-2">
              {['pdf', 'excel', 'csv'].map((format) => (
                <div key={format} className="flex items-center">
                  <input
                    type="radio"
                    id={format}
                    name="reportFormat"
                    value={format}
                    checked={reportFormat === format}
                    onChange={(e) => setReportFormat(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={format} className="ml-2 text-sm text-gray-700">
                    {format.toUpperCase()} - {format === 'pdf' ? 'Professional formatted document' : 
                     format === 'excel' ? 'Spreadsheet with charts and calculations' : 
                     'Raw data for analysis'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-clock text-gray-400"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Report Generation
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Large reports may take a few minutes to generate. You'll receive an email when ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Team Settings Modal */}
      <Modal
        isOpen={showTeamSettingsModal}
        onClose={() => setShowTeamSettingsModal(false)}
        title="Team Settings"
        size="xl"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTeamSettingsModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTeamSettings}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Notification Settings</h3>
            <div className="space-y-3">
              {[
                { key: 'email_alerts', label: 'Email Alerts for Critical Issues', desc: 'Receive email notifications for high-priority alerts' },
                { key: 'sms_alerts', label: 'SMS Alerts for Emergencies', desc: 'Get text messages for emergency situations' },
                { key: 'daily_digest', label: 'Daily Performance Digest', desc: 'Daily summary of team performance via email' },
                { key: 'weekly_reports', label: 'Weekly Team Reports', desc: 'Comprehensive weekly team performance reports' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id={setting.key}
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor={setting.key} className="text-sm font-medium text-gray-700">
                      {setting.label}
                    </label>
                    <p className="text-sm text-gray-500">{setting.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Dashboard Preferences</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default View Mode
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="grid">Grid View</option>
                  <option value="detail">Detail View</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Time Period
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-refresh Interval
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                  <option value="0">Manual only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Team Access Control */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Team Access Control</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamWorkload.slice(0, 3).map((member, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.member}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select className="text-sm border border-gray-300 rounded px-2 py-1">
                          <option>Full Access</option>
                          <option>Limited Access</option>
                          <option>View Only</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupervisorDashboard;
