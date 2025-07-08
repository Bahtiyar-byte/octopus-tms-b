import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause, Edit, Trash2, Copy } from 'lucide-react';
import { ModuleType, Workflow } from '../types/workflow.types';
import { getTemplatesByModule } from '../templates';
import { toast } from 'react-hot-toast';

interface WorkflowListProps {
  moduleType: ModuleType;
}

export const WorkflowList: React.FC<WorkflowListProps> = ({ moduleType }) => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    // Load workflows from localStorage
    const saved = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('workflow_')) {
        try {
          const workflow = JSON.parse(localStorage.getItem(key) || '');
          if (workflow.moduleType === moduleType) {
            saved.push(workflow);
          }
        } catch (e) {
          console.error('Failed to parse workflow:', e);
        }
      }
    }
    return saved;
  });

  const templates = getTemplatesByModule(moduleType);

  const handleCreateNew = () => {
    navigate(`/${moduleType}/workflows/builder`);
  };

  const handleCreateFromTemplate = (templateId: string) => {
    navigate(`/${moduleType}/workflows/builder?template=${templateId}`);
  };

  const handleEdit = (workflowId: string) => {
    navigate(`/${moduleType}/workflows/builder?id=${workflowId}`);
  };

  const handleToggleActive = (workflow: Workflow) => {
    const updated = { ...workflow, isActive: !workflow.isActive };
    localStorage.setItem(`workflow_${workflow.id}`, JSON.stringify(updated));
    setWorkflows(prev => prev.map(w => w.id === workflow.id ? updated : w));
    toast.success(`Workflow ${updated.isActive ? 'activated' : 'deactivated'}`);
  };

  const handleDelete = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      localStorage.removeItem(`workflow_${workflowId}`);
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      toast.success('Workflow deleted');
    }
  };

  const handleDuplicate = (workflow: Workflow) => {
    const duplicate = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      isActive: false,
      isDraft: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`workflow_${duplicate.id}`, JSON.stringify(duplicate));
    setWorkflows(prev => [...prev, duplicate]);
    toast.success('Workflow duplicated');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workflow Automation</h1>
        <p className="text-gray-600">Create and manage automated workflows for your operations</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <button
          onClick={handleCreateNew}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Workflow
        </button>
      </div>

      {/* My Workflows */}
      {workflows.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map(workflow => (
              <div
                key={workflow.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                  <button
                    onClick={() => handleToggleActive(workflow)}
                    className={`p-1 rounded ${workflow.isActive ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {workflow.isActive ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                </div>
                
                {workflow.description && (
                  <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      workflow.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {workflow.isDraft && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(workflow.id)}
                      className="p-1 text-gray-600 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(workflow)}
                      className="p-1 text-gray-600 hover:text-blue-600"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCreateFromTemplate(template.id)}
            >
              <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {template.category}
                </span>
                <span className="text-xs text-gray-500">
                  {template.nodes.length} nodes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};