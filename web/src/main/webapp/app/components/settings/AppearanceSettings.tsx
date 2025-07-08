import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AppearanceSettings as AppearanceSettingsType } from '../../types/settings';

interface AppearanceSettingsProps {
  initialAppearance: AppearanceSettingsType;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ initialAppearance }) => {
  const [appearance, setAppearance] = useState<AppearanceSettingsType>(initialAppearance);

  const handleChangeTheme = (theme: string) => {
    setAppearance({
      ...appearance,
      theme
    });
    toast.success(`Theme changed to ${theme}`);
  };

  const handleChangeSetting = (setting: keyof AppearanceSettingsType, value: string) => {
    setAppearance({
      ...appearance,
      [setting]: value
    });
  };

  const handleSaveAppearanceSettings = () => {
    toast.success('Appearance settings saved successfully');
  };

  const handleResetAppearanceSettings = () => {
    setAppearance({
      theme: 'default',
      sidebarPosition: 'left',
      navbarStyle: 'fixed',
      contentWidth: 'container',
      density: 'comfortable',
      fontFamily: 'poppins',
      fontSize: 'medium',
      primaryColor: '#2563eb',
      secondaryColor: '#4f46e5'
    });
    toast.success('Appearance settings reset to defaults');
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
        <p className="text-sm text-gray-600 mt-1">Customize the look and feel of your application</p>
      </div>

      {/* Theme Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`cursor-pointer rounded-lg border p-4 ${appearance.theme === 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handleChangeTheme('default')}
          >
            <div className="h-24 bg-white rounded-md border border-gray-200 mb-3 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded-md"></div>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">Default</h4>
              <p className="text-xs text-gray-500">Light theme with blue accents</p>
            </div>
          </div>

          <div 
            className={`cursor-pointer rounded-lg border p-4 ${appearance.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handleChangeTheme('dark')}
          >
            <div className="h-24 bg-gray-800 rounded-md border border-gray-700 mb-3 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded-md"></div>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">Dark</h4>
              <p className="text-xs text-gray-500">Dark theme with blue accents</p>
            </div>
          </div>

          <div 
            className={`cursor-pointer rounded-lg border p-4 ${appearance.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handleChangeTheme('light')}
          >
            <div className="h-24 bg-gray-50 rounded-md border border-gray-200 mb-3 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded-md"></div>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">Light</h4>
              <p className="text-xs text-gray-500">Extra light theme with blue accents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="sidebar-position" className="form-label">Sidebar Position</label>
            <select 
              id="sidebar-position" 
              className="form-control"
              value={appearance.sidebarPosition}
              onChange={(e) => handleChangeSetting('sidebarPosition', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label htmlFor="navbar-style" className="form-label">Navbar Style</label>
            <select 
              id="navbar-style" 
              className="form-control"
              value={appearance.navbarStyle}
              onChange={(e) => handleChangeSetting('navbarStyle', e.target.value)}
            >
              <option value="fixed">Fixed</option>
              <option value="static">Static</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div>
            <label htmlFor="content-width" className="form-label">Content Width</label>
            <select 
              id="content-width" 
              className="form-control"
              value={appearance.contentWidth}
              onChange={(e) => handleChangeSetting('contentWidth', e.target.value)}
            >
              <option value="container">Container</option>
              <option value="fluid">Fluid</option>
            </select>
          </div>

          <div>
            <label htmlFor="density" className="form-label">Density</label>
            <select 
              id="density" 
              className="form-control"
              value={appearance.density}
              onChange={(e) => handleChangeSetting('density', e.target.value)}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
      </div>

      {/* Typography Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="font-family" className="form-label">Font Family</label>
            <select 
              id="font-family" 
              className="form-control"
              value={appearance.fontFamily}
              onChange={(e) => handleChangeSetting('fontFamily', e.target.value)}
            >
              <option value="poppins">Poppins</option>
              <option value="roboto">Roboto</option>
              <option value="inter">Inter</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label htmlFor="font-size" className="form-label">Font Size</label>
            <select 
              id="font-size" 
              className="form-control"
              value={appearance.fontSize}
              onChange={(e) => handleChangeSetting('fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Color Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primary-color" className="form-label">Primary Color</label>
            <div className="flex">
              <input 
                type="color" 
                id="primary-color" 
                className="h-10 w-10 rounded border border-gray-300 mr-2"
                value={appearance.primaryColor}
                onChange={(e) => handleChangeSetting('primaryColor', e.target.value)}
              />
              <input 
                type="text" 
                className="form-control"
                value={appearance.primaryColor}
                onChange={(e) => handleChangeSetting('primaryColor', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="secondary-color" className="form-label">Secondary Color</label>
            <div className="flex">
              <input 
                type="color" 
                id="secondary-color" 
                className="h-10 w-10 rounded border border-gray-300 mr-2"
                value={appearance.secondaryColor}
                onChange={(e) => handleChangeSetting('secondaryColor', e.target.value)}
              />
              <input 
                type="text" 
                className="form-control"
                value={appearance.secondaryColor}
                onChange={(e) => handleChangeSetting('secondaryColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button 
          type="button" 
          className="btn btn-white"
          onClick={handleResetAppearanceSettings}
        >
          Reset to Defaults
        </button>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={handleSaveAppearanceSettings}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AppearanceSettings;