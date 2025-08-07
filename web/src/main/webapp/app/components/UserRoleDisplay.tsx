import React from 'react';
import { useUserStore } from '../store/userStore';

/**
 * Example component that demonstrates how to access user data from the Zustand store
 * This component displays the user's role and company type
 */
const UserRoleDisplay: React.FC = () => {
  // Access user data from the Zustand store
  const { role, companyType } = useUserStore();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">User Information</h2>
      <div className="space-y-2">
        <div>
          <span className="font-medium text-gray-700">Role: </span>
          <span className="text-gray-900">{role || 'Not logged in'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Company Type: </span>
          <span className="text-gray-900">{companyType || 'Not available'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserRoleDisplay;