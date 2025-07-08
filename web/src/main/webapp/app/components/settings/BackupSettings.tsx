import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BackupSettings as BackupSettingsType } from '../../types/settings';
import ToggleSwitch from '../ToggleSwitch';

interface BackupSettingsProps {
  initialBackupSettings: BackupSettingsType;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ initialBackupSettings }) => {
  const [backupSettings, setBackupSettings] = useState<BackupSettingsType>(initialBackupSettings);

  // Mock backup history data
  const backupHistory = [
    { id: '1', date: 'May 15, 2023 - 08:30 AM', size: '42.5 MB', type: 'Automatic' },
    { id: '2', date: 'May 14, 2023 - 08:30 AM', size: '42.3 MB', type: 'Automatic' },
    { id: '3', date: 'May 13, 2023 - 02:15 PM', size: '42.1 MB', type: 'Manual' },
    { id: '4', date: 'May 12, 2023 - 08:30 AM', size: '41.8 MB', type: 'Automatic' },
    { id: '5', date: 'May 11, 2023 - 08:30 AM', size: '41.5 MB', type: 'Automatic' }
  ];

  const handleToggleAutoBackup = () => {
    setBackupSettings({
      ...backupSettings,
      autoBackupEnabled: !backupSettings.autoBackupEnabled
    });
    toast.success(`Automatic backups ${backupSettings.autoBackupEnabled ? 'disabled' : 'enabled'}`);
  };

  const handleChangeBackupSetting = (setting: keyof BackupSettingsType, value: string | boolean) => {
    setBackupSettings({
      ...backupSettings,
      [setting]: value
    });
  };

  const handleCreateManualBackup = () => {
    toast.success('Creating manual backup...');
    setTimeout(() => {
      toast.success('Manual backup created successfully');
    }, 2000);
  };

  const handleDownloadBackup = (date: string) => {
    toast.success(`Downloading backup from ${date}...`);
    setTimeout(() => {
      toast.success('Backup downloaded successfully');
    }, 1500);
  };

  const handleRestoreBackup = (date: string) => {
    toast.success(`Preparing to restore from backup (${date})...`);
    setTimeout(() => {
      toast.success('System restored successfully from backup');
    }, 2500);
  };

  const handleExportData = (format: 'excel' | 'pdf' | 'csv') => {
    toast.success(`Exporting data as ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`Data exported as ${format.toUpperCase()} successfully`);
    }, 1500);
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Backup & Restore</h2>
        <p className="text-sm text-gray-600 mt-1">Manage system backups and data exports</p>
      </div>

      {/* Backup Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Settings</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-medium text-gray-900">Automatic Backups</h4>
              <p className="text-sm text-gray-600">Schedule regular system backups</p>
            </div>
            <ToggleSwitch 
              isOn={backupSettings.autoBackupEnabled} 
              onToggle={handleToggleAutoBackup}
            />
          </div>

          {backupSettings.autoBackupEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-100">
              <div>
                <label htmlFor="backup-frequency" className="form-label">Backup Frequency</label>
                <select 
                  id="backup-frequency" 
                  className="form-control"
                  value={backupSettings.frequency}
                  onChange={(e) => handleChangeBackupSetting('frequency', e.target.value)}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="retention-period" className="form-label">Retention Period (days)</label>
                <select 
                  id="retention-period" 
                  className="form-control"
                  value={backupSettings.retentionPeriod}
                  onChange={(e) => handleChangeBackupSetting('retentionPeriod', e.target.value)}
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Backup */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Manual Backup</h3>
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleCreateManualBackup}
          >
            <i className="fas fa-download mr-2"></i> Create Backup Now
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Create a manual backup of your system data</p>
      </div>

      {/* Backup History */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup History</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backupHistory.map(backup => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {backup.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        backup.type === 'Automatic' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleDownloadBackup(backup.date)}
                      >
                        Download
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleRestoreBackup(backup.date)}
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
        <p className="text-sm text-gray-600 mb-4">Export your data in different formats</p>
        <div className="flex space-x-3">
          <button 
            className="btn btn-white"
            onClick={() => handleExportData('excel')}
          >
            <i className="fas fa-file-excel mr-2 text-green-600"></i> Export as Excel
          </button>
          <button 
            className="btn btn-white"
            onClick={() => handleExportData('csv')}
          >
            <i className="fas fa-file-csv mr-2 text-blue-600"></i> Export as CSV
          </button>
          <button 
            className="btn btn-white"
            onClick={() => handleExportData('pdf')}
          >
            <i className="fas fa-file-pdf mr-2 text-red-600"></i> Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;