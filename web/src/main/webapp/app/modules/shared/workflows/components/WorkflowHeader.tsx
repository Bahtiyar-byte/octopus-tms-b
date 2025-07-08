import React from 'react';
import { Save, Play, Trash2, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModuleType } from '../types/workflow.types';

interface WorkflowHeaderProps {
  moduleType: ModuleType;
  onSave: () => void;
  onTest: () => void;
  onClear: () => void;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  moduleType,
  onSave,
  onTest,
  onClear
}) => {
  const navigate = useNavigate();

  const getModuleColor = () => {
    switch (moduleType) {
      case 'broker': return 'bg-blue-600';
      case 'carrier': return 'bg-green-600';
      case 'shipper': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getModuleName = () => {
    return moduleType.charAt(0).toUpperCase() + moduleType.slice(1);
  };

  return (
    <div className={`${getModuleColor()} text-white px-6 py-4 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <Home size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Workflow Builder</h1>
            <p className="text-sm text-white/80">{getModuleName()} Module</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTest}
            className="btn bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2"
          >
            <Play size={18} />
            Test Flow
          </button>
          
          <button
            onClick={onSave}
            className="btn bg-white text-gray-800 hover:bg-gray-100 flex items-center gap-2"
          >
            <Save size={18} />
            Save Workflow
          </button>

          <div className="w-px h-8 bg-white/30 mx-2" />

          <button
            onClick={onClear}
            className="text-white/80 hover:text-white transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};