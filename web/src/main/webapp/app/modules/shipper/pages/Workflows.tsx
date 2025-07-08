import React from 'react';
import { WorkflowList } from '../../shared/workflows/components/WorkflowList';

const Workflows: React.FC = () => {
  return <WorkflowList moduleType="shipper" />;
};

export default Workflows;