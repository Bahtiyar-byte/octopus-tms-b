import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WorkflowBuilder } from './WorkflowBuilder';
import { ModuleType } from '../types/workflow.types';

interface WorkflowBuilderWrapperProps {
  moduleType: ModuleType;
}

export const WorkflowBuilderWrapper: React.FC<WorkflowBuilderWrapperProps> = ({ moduleType }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const workflowId = searchParams.get('id');

  const handleBack = () => {
    // Navigate back to the workflows list page
    navigate(`/${moduleType === 'carrier' ? '' : moduleType + '/'}workflows`);
  };

  const handleSave = () => {
    // After save, navigate back to workflows list
    handleBack();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Workflows</span>
          </button>
        </div>
      </div>
      
      <WorkflowBuilder 
        moduleType={moduleType}
        templateId={templateId}
        workflowId={workflowId}
        onSaveSuccess={handleSave}
      />
    </div>
  );
};