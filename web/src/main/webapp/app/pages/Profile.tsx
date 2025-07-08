import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Edit2, Key, Activity, Truck, CheckSquare, Star, Bell, Globe, Layout } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Profile data from authenticated user
  const profileData = {
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
    email: user?.email || '',
    username: user?.username || '',
    phone: user?.phone || '(555) 000-0000',
    department: user?.department || 'Not specified',
    lastLogin: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A',
    role: user?.role || 'user',
    avatar: user?.avatar || null
  };

  // Statistics data
  const statistics = {
    activeDriversToday: 28,
    totalDriversManaged: 42,
    totalCustomersServed: 76,
    avgResponseTime: '2.4 min'
  };

  // Activity data
  const activityData = {
    actionsToday: 38,
    loadsDispatched: 156,
    tasksCompleted: 324,
    performanceScore: 92
  };

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'English',
    defaultView: 'Dashboard',
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true
  });

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = () => {
    // Here you would save preferences to backend
    console.log('Saving preferences:', preferences);
    // Show success message
    alert('Preferences saved successfully!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profile Information
            </h2>

            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  EA
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {profileData.role}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Email:</span>
                    <span className="font-medium">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Username:</span>
                    <span className="font-medium">{profileData.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Phone:</span>
                    <span className="font-medium">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Department:</span>
                    <span className="font-medium">{profileData.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Last Login:</span>
                    <span className="font-medium">{profileData.lastLogin}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Your Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Your Activity
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Actions Today */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium opacity-90">Actions Today</h3>
                  <Activity className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{activityData.actionsToday}</p>
              </div>

              {/* Loads Dispatched */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium opacity-90">Loads Dispatched</h3>
                  <Truck className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{activityData.loadsDispatched}</p>
              </div>

              {/* Tasks Completed */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium opacity-90">Tasks Completed</h3>
                  <CheckSquare className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{activityData.tasksCompleted}</p>
              </div>

              {/* Performance Score */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium opacity-90">Performance Score</h3>
                  <Star className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{activityData.performanceScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Statistics & Preferences */}
        <div className="space-y-8">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Active Drivers Today</span>
                <span className="font-bold text-lg">{statistics.activeDriversToday}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Drivers Managed</span>
                <span className="font-bold text-lg">{statistics.totalDriversManaged}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Customers Served</span>
                <span className="font-bold text-lg">{statistics.totalCustomersServed}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Avg. Response Time</span>
                <span className="font-bold text-lg">{statistics.avgResponseTime}</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5 text-blue-600" />
              Preferences
            </h2>
            <div className="space-y-4">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>

              {/* Default View */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                <select
                  value={preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Dashboard">Dashboard</option>
                  <option value="Loads">Loads</option>
                  <option value="Tracking">Tracking</option>
                </select>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">SMS Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.inAppNotifications}
                      onChange={(e) => handlePreferenceChange('inAppNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">In-App Notifications</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={profileData.fullName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={profileData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue={profileData.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  defaultValue={profileData.department}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;