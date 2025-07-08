import React, { useState } from 'react';
import { Card, Modal } from '../../../components';
import { mockActions, notify } from '../../../services';

interface Driver {
  id: string;
  name: string;
  initials: string;
  phone: string;
  status: 'active' | 'off_duty' | 'inactive';
  color: string;
  stats: {
    deliveries: number;
    onTime: number;
    rating: number;
  };
  currentLoad?: {
    status: string;
    route: string;
  };
}

const Drivers: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [messageText, setMessageText] = useState('');

  const drivers: Driver[] = [
    {
      id: '1',
      name: 'John Smith',
      initials: 'JS',
      phone: '(555) 123-4567',
      status: 'active',
      color: 'blue',
      stats: {
        deliveries: 12,
        onTime: 95,
        rating: 4.8
      },
      currentLoad: {
        status: 'On duty - In transit',
        route: 'Denver, CO → Phoenix, AZ'
      }
    },
    {
      id: '2',
      name: 'Maria Garcia',
      initials: 'MG',
      phone: '(555) 987-6543',
      status: 'active',
      color: 'green',
      stats: {
        deliveries: 10,
        onTime: 100,
        rating: 4.9
      },
      currentLoad: {
        status: 'On duty - In transit',
        route: 'Dallas, TX → Houston, TX'
      }
    },
    {
      id: '3',
      name: 'Robert Johnson',
      initials: 'RJ',
      phone: '(555) 456-7890',
      status: 'active',
      color: 'red',
      stats: {
        deliveries: 11,
        onTime: 90,
        rating: 4.7
      },
      currentLoad: {
        status: 'On duty - In transit',
        route: 'Miami, FL → Atlanta, GA'
      }
    },
    {
      id: '4',
      name: 'Sarah Williams',
      initials: 'SW',
      phone: '(555) 321-0987',
      status: 'off_duty',
      color: 'cyan',
      stats: {
        deliveries: 9,
        onTime: 95,
        rating: 4.8
      }
    }
  ];

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId === selectedDriver ? null : driverId);
  };

  const handleAddNewDriver = () => {
    setShowDriverModal(true);
  };

  const handleSaveNewDriver = async () => {
    setLoading(true);
    try {
      // This would call the API in a real app
      await mockActions.saveSettings({ action: 'add_driver' });
      setShowDriverModal(false);
    } catch (error) {
      console.error('Error adding driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageDriver = () => {
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    if (!selectedDriver || !messageText.trim()) return;

    setLoading(true);
    try {
      const driver = drivers.find(d => d.id === selectedDriver);
      if (driver) {
        await mockActions.sendTrackingUpdate(driver.currentLoad?.route || 'N/A', messageText);
        setMessageText('');
        setShowMessageModal(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallDriver = async () => {
    if (!selectedDriver) return;

    const driver = drivers.find(d => d.id === selectedDriver);
    if (driver) {
      await notify(`Calling ${driver.name} at ${driver.phone}...`);
    }
  };

  const handleStatusChange = async (driverId: string, newStatus: 'active' | 'off_duty') => {
    setLoading(true);
    try {
      await notify(`Driver status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick action handlers
  const handleMessageAllDrivers = async () => {
    setLoading(true);
    try {
      await notify('Message sent to all drivers');
    } catch (error) {
      console.error('Error messaging all drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDriverList = async () => {
    setLoading(true);
    try {
      await notify('Driver list download started');
    } catch (error) {
      console.error('Error downloading driver list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdateHours = async () => {
    setLoading(true);
    try {
      await notify('Hours updated successfully for all drivers');
    } catch (error) {
      console.error('Error updating hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageDriverTags = async () => {
    setLoading(true);
    try {
      await notify('Opening driver tag management');
    } catch (error) {
      console.error('Error managing tags:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600">Manage your fleet and driver assignments</p>
        </div>
        <div>
          <button
            className="btn btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleAddNewDriver}
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Add New Driver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {drivers.map(driver => {
          const isSelected = driver.id === selectedDriver;
          const bgColorClass = isSelected ? 'ring-2 ring-blue-500 transform scale-[1.02]' : '';

          return (
            <div
              key={driver.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${bgColorClass}`}
              onClick={() => handleDriverSelect(driver.id)}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    driver.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : driver.status === 'off_duty'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {driver.status === 'active' ? 'Active' : driver.status === 'off_duty' ? 'Off Duty' : 'Inactive'}
                  </span>
                  <div className="dropdown relative">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDriverSelect(driver.id);
                      }}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-4">
                  <div className={`h-20 w-20 rounded-full bg-${driver.color}-500 text-white flex items-center justify-center text-2xl font-bold mb-3`}>
                    {driver.initials}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                  <p className="text-gray-500">{driver.phone}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{driver.stats.deliveries}</div>
                    <div className="text-xs text-gray-500">Deliveries</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{driver.stats.onTime}%</div>
                    <div className="text-xs text-gray-500">On-time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{driver.stats.rating}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                {driver.currentLoad ? (
                  <div className={`text-center p-3 rounded-lg ${
                    driver.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                  }`}>
                    <div className="font-medium">{driver.currentLoad.status}</div>
                    <div className="text-sm">{driver.currentLoad.route}</div>
                  </div>
                ) : (
                  <div className="text-center p-3 rounded-lg bg-gray-50 text-gray-700">
                    <div className="font-medium">Off duty</div>
                    <div className="text-sm">Available tomorrow</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-id-card mr-2 text-blue-600"></i>
            Driver Information
          </h2>

          <Card className="h-full shadow-sm">
            {selectedDriver ? (
              <div>
                <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <div className="flex space-x-3">
                    <button
                      className={`px-4 py-2 ${activeTab === 'info' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 font-medium hover:text-gray-700'}`}
                      onClick={() => setActiveTab('info')}
                    >
                      Info
                    </button>
                    <button
                      className={`px-4 py-2 ${activeTab === 'history' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 font-medium hover:text-gray-700'}`}
                      onClick={() => setActiveTab('history')}
                    >
                      Load History
                    </button>
                    <button
                      className={`px-4 py-2 ${activeTab === 'documents' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 font-medium hover:text-gray-700'}`}
                      onClick={() => setActiveTab('documents')}
                    >
                      Documents
                    </button>
                    <button
                      className={`px-4 py-2 ${activeTab === 'eld' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500 font-medium hover:text-gray-700'}`}
                      onClick={() => setActiveTab('eld')}
                    >
                      ELD Status
                    </button>
                  </div>
                </div>

                {(() => {
                  const driver = drivers.find(d => d.id === selectedDriver);
                  if (!driver) return null;

                  if (activeTab === 'info') {
                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                            <p className="font-medium text-gray-900">{driver.name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                            <p className="font-medium text-gray-900">{driver.phone}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                            <p className={`font-medium ${
                              driver.status === 'active'
                                ? 'text-green-600'
                                : driver.status === 'off_duty'
                                  ? 'text-yellow-600'
                                  : 'text-gray-600'
                            }`}>
                              {driver.status === 'active' ? 'Active' : driver.status === 'off_duty' ? 'Off Duty' : 'Inactive'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-3">Performance Metrics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">Deliveries</span>
                                <span className="text-gray-900 font-bold">{driver.stats.deliveries}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(driver.stats.deliveries / 15) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">On-Time %</span>
                                <span className="text-gray-900 font-bold">{driver.stats.onTime}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    driver.stats.onTime >= 95
                                      ? 'bg-green-500'
                                      : driver.stats.onTime >= 85
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${driver.stats.onTime}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">Rating</span>
                                <span className="text-gray-900 font-bold">{driver.stats.rating} / 5.0</span>
                              </div>
                              <div className="flex text-yellow-400 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(driver.stats.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {driver.currentLoad && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Current Assignment</h3>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                              <div className="flex items-start">
                                <div className="bg-green-100 rounded-full p-2 text-green-600 mr-3">
                                  <i className="fas fa-truck"></i>
                                </div>
                                <div>
                                  <h4 className="font-medium text-green-800">{driver.currentLoad.status}</h4>
                                  <p className="text-green-600">{driver.currentLoad.route}</p>
                                  <div className="mt-2 flex items-center text-sm text-green-700">
                                    <i className="fas fa-clock mr-1"></i>
                                    <span>ETA: May 25, 2025 @ 14:30</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <button
                            className="btn btn-outline-primary flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                            onClick={handleMessageDriver}
                            disabled={loading}
                          >
                            <i className="fas fa-comment mr-2"></i>Message
                          </button>
                          <button
                            className="btn btn-outline-secondary flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={handleCallDriver}
                            disabled={loading}
                          >
                            <i className="fas fa-phone-alt mr-2"></i>Call
                          </button>
                          {driver.status === 'active' ? (
                            <button
                              className="btn btn-outline-warning flex items-center px-4 py-2 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-50 transition-colors"
                              onClick={() => handleStatusChange(driver.id, 'off_duty')}
                              disabled={loading}
                            >
                              <i className="fas fa-pause-circle mr-2"></i>Set Off Duty
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-success flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors"
                              onClick={() => handleStatusChange(driver.id, 'active')}
                              disabled={loading}
                            >
                              <i className="fas fa-play-circle mr-2"></i>Set Active
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  } else if (activeTab === 'history') {
                    return (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Load History</h3>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">LD1009</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Chicago, IL → Detroit, MI</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">May 19, 2025</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Delivered</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <span className="mr-2">4.8</span>
                                    <div className="flex text-yellow-400">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <svg
                                          key={star}
                                          className={`w-4 h-4 ${star <= 4.8 ? 'text-yellow-400' : 'text-gray-300'}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">LD1003</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">New York, NY → Boston, MA</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">May 15, 2025</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Delivered</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <span className="mr-2">4.9</span>
                                    <div className="flex text-yellow-400">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <svg
                                          key={star}
                                          className={`w-4 h-4 ${star <= 4.9 ? 'text-yellow-400' : 'text-gray-300'}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  } else if (activeTab === 'documents') {
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Driver Documents</h3>
                          <button className="btn btn-sm btn-outline-primary px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
                            <i className="fas fa-upload mr-1"></i> Upload
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                                <i className="fas fa-id-card"></i>
                              </div>
                              <div>
                                <h4 className="font-medium">Driver's License</h4>
                                <p className="text-sm text-gray-600">Expires: 12/31/2024</p>
                              </div>
                              <div className="ml-auto">
                                <i className="fas fa-eye text-blue-600"></i>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-green-100 p-2 rounded-lg text-green-600 mr-3">
                                <i className="fas fa-file-medical"></i>
                              </div>
                              <div>
                                <h4 className="font-medium">Medical Certificate</h4>
                                <p className="text-sm text-gray-600">Expires: 06/15/20252025</p>
                              </div>
                              <div className="ml-auto">
                                <i className="fas fa-eye text-blue-600"></i>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mr-3">
                                <i className="fas fa-certificate"></i>
                              </div>
                              <div>
                                <h4 className="font-medium">CDL License</h4>
                                <p className="text-sm text-gray-600">Expires: 08/22/2025</p>
                              </div>
                              <div className="ml-auto">
                                <i className="fas fa-eye text-blue-600"></i>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                              <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mr-3">
                                <i className="fas fa-file-contract"></i>
                              </div>
                              <div>
                                <h4 className="font-medium">Contractor Agreement</h4>
                                <p className="text-sm text-gray-600">Signed: 01/15/2025</p>
                              </div>
                              <div className="ml-auto">
                                <i className="fas fa-eye text-blue-600"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (activeTab === 'eld') {
                    return (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Electronic Logging Device Status</h3>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                              <i className="fas fa-clock"></i>
                            </div>
                            <div>
                              <h4 className="font-medium">Current Status</h4>
                              <p className="text-gray-600">On Duty - Driving</p>
                            </div>
                            <div className="ml-auto">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">11-Hour Driving Limit</span>
                                <span className="font-medium">8.5h / 11h</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '77%' }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">14-Hour On-Duty Limit</span>
                                <span className="font-medium">11h / 14h</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">70-Hour 8-Day Limit</span>
                                <span className="font-medium">42h / 70h</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between">
                              <span className="text-gray-600">Last Updated:</span>
                              <span className="font-medium">May 23, 2025 @ 10:45 AM</span>
                            </div>
                          </div>
                        </div>

                        <button className="btn btn-outline-primary px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
                          <i className="fas fa-sync-alt mr-2"></i>
                          Refresh ELD Data
                        </button>
                      </div>
                    );
                  }

                  return null;
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <i className="fas fa-user text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No driver selected</h3>
                <p className="max-w-sm">Click on a driver card to view their detailed information and manage their assignments.</p>
              </div>
            )}
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <i className="fas fa-bolt mr-2 text-blue-600"></i>
            Quick Actions
          </h2>

          <Card className="shadow-sm">
            <div className="space-y-1">
              <button
                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={handleMessageAllDrivers}
                disabled={loading}
              >
                <div className="flex items-center">
                  <i className="fas fa-comment text-blue-500 mr-3"></i>
                  <span className="font-medium">Message All Drivers</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>

              <button
                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={handleDownloadDriverList}
                disabled={loading}
              >
                <div className="flex items-center">
                  <i className="fas fa-download text-green-500 mr-3"></i>
                  <span className="font-medium">Download Driver List</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>

              <button
                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={handleBulkUpdateHours}
                disabled={loading}
              >
                <div className="flex items-center">
                  <i className="fas fa-clock text-orange-500 mr-3"></i>
                  <span className="font-medium">Bulk Update Hours</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>

              <button
                className="w-full text-left px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={handleManageDriverTags}
                disabled={loading}
              >
                <div className="flex items-center">
                  <i className="fas fa-tags text-purple-500 mr-3"></i>
                  <span className="font-medium">Manage Driver Tags</span>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </Card>

          <div className="mt-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
              Fleet Overview
            </h2>

            <Card className="shadow-sm">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Driver Status</span>
                    <span className="text-xs text-gray-500">4 Total</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 mr-4">
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="flex h-full">
                          <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                          <div className="h-full bg-yellow-500" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3 text-xs">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                        <span>3 Active</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                        <span>1 Off Duty</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-600 mb-1">Total Deliveries</div>
                      <div className="text-xl font-bold text-blue-800">42</div>
                      <div className="text-xs text-blue-700 mt-1">This Week</div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-600 mb-1">Avg. Rating</div>
                      <div className="text-xl font-bold text-green-800">4.8</div>
                      <div className="text-xs text-green-700 mt-1">out of 5.0</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add New Driver Modal */}
      <Modal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        title="Add New Driver"
        size="lg"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowDriverModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSaveNewDriver}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Driver'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="john.smith@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver ID</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="D12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              placeholder="DL1234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Expiration</label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3">
              <option value="active">Active</option>
              <option value="off_duty">Off Duty</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              rows={3}
              placeholder="Additional notes about the driver"
            ></textarea>
          </div>
        </div>
      </Modal>

      {/* Message Driver Modal */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Send Message"
        size="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <button
              className="btn-secondary px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setShowMessageModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleSendMessage}
              disabled={loading || !messageText.trim()}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        }
      >
        {selectedDriver && (
          <div>
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-2">
                  {(() => {
                    const driver = drivers.find(d => d.id === selectedDriver);
                    return driver ? driver.initials : '';
                  })()}
                </div>
                <div>
                  <h4 className="font-medium">
                    {(() => {
                      const driver = drivers.find(d => d.id === selectedDriver);
                      return driver ? driver.name : '';
                    })()}
                  </h4>
                  <p className="text-sm text-gray-600">Driver</p>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                  rows={4}
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-2">
              <h5 className="text-sm font-medium mb-2">Message Templates</h5>
              <div className="space-y-2">
                <button
                  className="w-full text-left text-sm px-3 py-2 rounded border border-gray-200 hover:bg-gray-100"
                  onClick={() => setMessageText("Please provide an update on your current status.")}
                >
                  Request Status Update
                </button>
                <button
                  className="w-full text-left text-sm px-3 py-2 rounded border border-gray-200 hover:bg-gray-100"
                  onClick={() => setMessageText("Your delivery has been rescheduled. Please call dispatch for details.")}
                >
                  Delivery Rescheduled
                </button>
                <button
                  className="w-full text-left text-sm px-3 py-2 rounded border border-gray-200 hover:bg-gray-100"
                  onClick={() => setMessageText("New load assignment available. Please confirm availability.")}
                >
                  New Load Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Drivers;