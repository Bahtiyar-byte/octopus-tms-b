import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UnifiedWorkflowBuilder as WorkflowBuilderComponent } from '../modules/shared/workflows/components/UnifiedWorkflowBuilder';

const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const workflowId = searchParams.get('id');

  const handleBack = () => {
    navigate('/workflows');
  };

  const handleSave = () => {
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
      
      <WorkflowBuilderComponent 
        templateId={templateId}
        workflowId={workflowId}
        onSaveSuccess={handleSave}
      />
    </div>
  );
};

export default WorkflowBuilder;