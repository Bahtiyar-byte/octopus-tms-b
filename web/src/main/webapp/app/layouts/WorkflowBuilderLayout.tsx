import React from 'react';
import { Outlet } from 'react-router-dom';

const WorkflowBuilderLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
    </div>
  );
};

export default WorkflowBuilderLayout;