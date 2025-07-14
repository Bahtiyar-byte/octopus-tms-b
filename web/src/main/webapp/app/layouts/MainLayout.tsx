import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../modules/shared/components/navigation/TopBar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;