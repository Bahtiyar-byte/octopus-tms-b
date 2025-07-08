import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { NotificationChannels, NotificationTypes } from '../../types/settings';
import ToggleSwitch from '../ToggleSwitch';

interface NotificationSettingsProps {
  initialNotificationChannels: NotificationChannels;
  initialNotificationTypes: NotificationTypes;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  initialNotificationChannels, 
  initialNotificationTypes 
}) => {
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannels>(initialNotificationChannels);
  const [notificationTypes, setNotificationTypes] = useState<NotificationTypes>(initialNotificationTypes);

  const handleToggleNotificationChannel = (channel: 'email' | 'sms' | 'inApp') => {
    setNotificationChannels({
      ...notificationChannels,
      [channel]: !notificationChannels[channel]
    });
    toast.success(`${channel.toUpperCase()} notifications ${notificationChannels[channel] ? 'disabled' : 'enabled'}`);
  };

  const handleToggleNotificationType = (
    type: 'locationUpdates' | 'delayAlerts' | 'statusChanges' | 'weatherAlerts' | 'systemNotifications',
    channel: 'email' | 'sms' | 'inApp'
  ) => {
    setNotificationTypes({
      ...notificationTypes,
      [type]: {
        ...notificationTypes[type],
        [channel]: !notificationTypes[type][channel]
      }
    });
  };

  const handleSaveNotificationSettings = () => {
    toast.success('Notification settings saved successfully');
  };

  const handleResetNotificationSettings = () => {
    setNotificationChannels({
      email: true,
      sms: true,
      inApp: true
    });

    setNotificationTypes({
      locationUpdates: { email: true, sms: false, inApp: true },
      delayAlerts: { email: true, sms: true, inApp: true },
      statusChanges: { email: true, sms: false, inApp: true },
      weatherAlerts: { email: true, sms: true, inApp: true },
      systemNotifications: { email: true, sms: false, inApp: true }
    });

    toast.success('Notification settings reset to defaults');
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure how and when you receive notifications</p>
      </div>

      {/* Notification Channels */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <ToggleSwitch 
                isOn={notificationChannels.email} 
                onToggle={() => handleToggleNotificationChannel('email')}
              />
            </div>
            
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-base font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via text message</p>
              </div>
              <ToggleSwitch 
                isOn={notificationChannels.sms} 
                onToggle={() => handleToggleNotificationChannel('sms')}
              />
            </div>
            
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-base font-medium text-gray-900">In-App Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications within the application</p>
              </div>
              <ToggleSwitch 
                isOn={notificationChannels.inApp} 
                onToggle={() => handleToggleNotificationChannel('inApp')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification Type
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SMS
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In-App
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Location Updates</div>
                  <div className="text-xs text-gray-500">When a driver's location is updated</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.locationUpdates.email} 
                    onToggle={() => handleToggleNotificationType('locationUpdates', 'email')}
                    disabled={!notificationChannels.email}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.locationUpdates.sms} 
                    onToggle={() => handleToggleNotificationType('locationUpdates', 'sms')}
                    disabled={!notificationChannels.sms}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.locationUpdates.inApp} 
                    onToggle={() => handleToggleNotificationType('locationUpdates', 'inApp')}
                    disabled={!notificationChannels.inApp}
                  />
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Delay Alerts</div>
                  <div className="text-xs text-gray-500">When a shipment is delayed</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.delayAlerts.email} 
                    onToggle={() => handleToggleNotificationType('delayAlerts', 'email')}
                    disabled={!notificationChannels.email}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.delayAlerts.sms} 
                    onToggle={() => handleToggleNotificationType('delayAlerts', 'sms')}
                    disabled={!notificationChannels.sms}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.delayAlerts.inApp} 
                    onToggle={() => handleToggleNotificationType('delayAlerts', 'inApp')}
                    disabled={!notificationChannels.inApp}
                  />
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Status Changes</div>
                  <div className="text-xs text-gray-500">When a load status changes</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.statusChanges.email} 
                    onToggle={() => handleToggleNotificationType('statusChanges', 'email')}
                    disabled={!notificationChannels.email}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.statusChanges.sms} 
                    onToggle={() => handleToggleNotificationType('statusChanges', 'sms')}
                    disabled={!notificationChannels.sms}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.statusChanges.inApp} 
                    onToggle={() => handleToggleNotificationType('statusChanges', 'inApp')}
                    disabled={!notificationChannels.inApp}
                  />
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Weather Alerts</div>
                  <div className="text-xs text-gray-500">Severe weather affecting routes</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.weatherAlerts.email} 
                    onToggle={() => handleToggleNotificationType('weatherAlerts', 'email')}
                    disabled={!notificationChannels.email}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.weatherAlerts.sms} 
                    onToggle={() => handleToggleNotificationType('weatherAlerts', 'sms')}
                    disabled={!notificationChannels.sms}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.weatherAlerts.inApp} 
                    onToggle={() => handleToggleNotificationType('weatherAlerts', 'inApp')}
                    disabled={!notificationChannels.inApp}
                  />
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">System Notifications</div>
                  <div className="text-xs text-gray-500">System updates and maintenance</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.systemNotifications.email} 
                    onToggle={() => handleToggleNotificationType('systemNotifications', 'email')}
                    disabled={!notificationChannels.email}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.systemNotifications.sms} 
                    onToggle={() => handleToggleNotificationType('systemNotifications', 'sms')}
                    disabled={!notificationChannels.sms}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ToggleSwitch 
                    isOn={notificationTypes.systemNotifications.inApp} 
                    onToggle={() => handleToggleNotificationType('systemNotifications', 'inApp')}
                    disabled={!notificationChannels.inApp}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button 
          type="button" 
          className="btn btn-white"
          onClick={handleResetNotificationSettings}
        >
          Reset to Defaults
        </button>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={handleSaveNotificationSettings}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;