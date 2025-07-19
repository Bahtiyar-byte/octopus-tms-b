import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/core/user.types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login({
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      // Redirect based on user role (comparing enum values)
      if (response.user.role === UserRole.BROKER || response.user.role === UserRole.ADMIN) {
        navigate('/broker/dashboard');
      } else if (response.user.role === UserRole.SHIPPER) {
        navigate('/shipper/dashboard');
      } else if (response.user.role === UserRole.CARRIER) {
        navigate('/carrier/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  // Define user type
  type DemoUser = {
    role: string;
    username: string;
    password: string;
    description?: string;
  };

  // List of sample user credentials for demo purposes, grouped by role
  const userGroups: Record<string, { name: string; color: string; users: DemoUser[] }> = {
    carrier: {
      name: 'Carrier Group',
      color: 'gray',
      users: [
        { role: 'Dispatcher', username: 'dispatcher1', password: 'password' },
        { role: 'Operator', username: 'operator1', password: 'password' },
        { role: 'Supervisor', username: 'supervisor1', password: 'password' },
        { role: 'Admin', username: 'admin', password: 'password' },
        { role: 'Carrier', username: 'carrier1', password: 'password' }
      ]
    },
    broker: {
      name: 'Broker Group',
      color: 'blue',
      users: [
        { role: 'Broker 1', username: 'broker1', password: 'password', description: 'Emily Anderson' },
        { role: 'Broker 2', username: 'broker2', password: 'password', description: 'David Martinez' },
        { role: 'Broker 3', username: 'broker3', password: 'password', description: 'Jessica Williams' }
      ]
    },
    shipper: {
      name: 'Shipper Group',
      color: 'green',
      users: [
        { role: 'Shipper 1', username: 'shipper1', password: 'password', description: 'Tom Shanahan' },
        { role: 'Shipper 2', username: 'shipper2', password: 'password', description: 'Lisa Chen' },
        { role: 'Shipper 3', username: 'shipper3', password: 'password', description: 'Mark Thompson' }
      ]
    }
  };

  const handleFillCredentials = (username: string) => {
    setFormData({
      ...formData,
      username,
      password: 'password'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                O
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Octopus TMS</h1>
          <p className="text-xl text-blue-100">Transportation Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Log In to Your Account</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Demo Account Quick Access */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-700 mb-4">Demo Accounts (Click to fill):</h3>
            
            {Object.entries(userGroups).map(([groupKey, group]) => (
              <div key={groupKey} className="mb-6">
                <h4 className={`text-sm font-semibold mb-3 ${
                  groupKey === 'carrier' ? 'text-gray-700' :
                  groupKey === 'broker' ? 'text-blue-700' :
                  'text-green-700'
                }`}>{group.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {group.users.map((user, index) => (
                    <button
                      key={index}
                      onClick={() => handleFillCredentials(user.username)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] ${
                        groupKey === 'carrier' 
                          ? 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400' 
                          : groupKey === 'broker' 
                          ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                          : 'border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400'
                      }`}
                      title={user.description || user.role}
                    >
                      <div className="font-medium text-gray-800">{user.role}</div>
                      {user.description && (
                        <div className="text-xs text-gray-600 mt-1">{user.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <p className="text-sm text-gray-500 mt-6 text-center">
              All demo accounts use password: "password"
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-blue-100">
          © 2025 Octopus TMS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
