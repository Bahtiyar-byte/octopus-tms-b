import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause, Edit, Trash2, Copy } from 'lucide-react';
import { Workflow } from '../modules/shared/workflows/types/workflow.types';
import { getAllTemplates } from '../modules/shared/workflows/templates/index';
import { toast } from 'react-hot-toast';

const Workflows: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    // Load all workflows from localStorage
    const saved = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('workflow_')) {
        try {
          const workflow = JSON.parse(localStorage.getItem(key) || '');
          saved.push(workflow);
        } catch (e) {
        }
      }
    }
    return saved;
  });

  const templates = getAllTemplates();

  const handleCreateNew = () => {
    navigate('/workflows/builder');
  };

  const handleCreateFromTemplate = (templateId: string) => {
    navigate(`/workflows/builder?template=${templateId}`);
  };

  const handleEdit = (workflowId: string) => {
    navigate(`/workflows/builder?id=${workflowId}`);
  };

  const handleToggleActive = (workflow: Workflow) => {
    const updated = { ...workflow, isActive: !workflow.isActive };
    localStorage.setItem(`workflow_${workflow.id}`, JSON.stringify(updated));
    setWorkflows(prev => prev.map(w => w.id === workflow.id ? updated : w));
    toast.success(`Workflow ${updated.isActive ? 'activated' : 'deactivated'}`);
  };

  const handleDuplicate = (workflow: Workflow) => {
    const newWorkflow = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`workflow_${newWorkflow.id}`, JSON.stringify(newWorkflow));
    setWorkflows(prev => [...prev, newWorkflow]);
    toast.success('Workflow duplicated');
  };

  const handleDelete = (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      localStorage.removeItem(`workflow_${workflowId}`);
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      toast.success('Workflow deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Management</h1>
          <p className="text-gray-600">Create and manage automated workflows for your operations</p>
        </div>

        <div className="mb-8">
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Workflow
          </button>
        </div>

        {templates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Start from a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCreateFromTemplate(template.id)}
                >
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Workflows</h2>
          {workflows.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No workflows created yet. Start by creating a new workflow or using a template.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workflows.map(workflow => (
                    <tr key={workflow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{workflow.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(workflow)}
                            className="text-gray-600 hover:text-gray-900"
                            title={workflow.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {workflow.isActive ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button
                            onClick={() => handleEdit(workflow.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(workflow)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Duplicate"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(workflow.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workflows;