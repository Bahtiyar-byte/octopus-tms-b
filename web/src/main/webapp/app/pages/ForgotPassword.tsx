import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components';
import { authService } from '../services';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await authService.requestPasswordReset({ email });
      setSuccess(true);
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-700 to-blue-900">
      <div className="container mx-auto px-4 py-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-white text-blue-700 flex items-center justify-center text-3xl font-bold">
                O
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Octopus TMS</h1>
            <p className="text-blue-100">Transportation Management System</p>
          </div>
          
          <Card className="shadow-lg">
            {success ? (
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <i className="fas fa-check-circle text-green-500 text-5xl"></i>
                </div>
                <h2 className="text-xl font-semibold mb-4">Reset Link Sent!</h2>
                <p className="text-gray-600 mb-6">
                  If an account exists with the email address <strong>{email}</strong>, you'll receive 
                  password reset instructions shortly.
                </p>
                <Link 
                  to="/login" 
                  className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-center mb-6">Reset Your Password</h2>
                
                <p className="text-gray-600 mb-6">
                  Enter your email address below and we'll send you instructions to reset your password.
                </p>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                    <p>{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Instructions...
                      </span>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500">
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </Card>
          
          <p className="mt-4 text-center text-sm text-blue-100">
            &copy; 2025 Octopus TMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;