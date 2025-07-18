import React from 'react';
import { X } from 'lucide-react';
import { NodeType } from '../types/workflow.types';
import { useWorkflowStore } from '../store/workflowStore';
import { getNodeIcon } from '../utils/nodeHelpers';

interface NodePaletteProps {
  onClose: () => void;
}

interface NodeTypeItem {
  type: NodeType;
  label: string;
  description: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Start your workflow with an event'
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Add decision logic to your workflow'
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Perform operations and tasks'
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Add time delays between steps'
  }
];

export const UnifiedNodePalette: React.FC<NodePaletteProps> = ({ onClose }) => {
  const { addNode } = useWorkflowStore();

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (nodeType: NodeType) => {
    const position = { x: 100, y: 100 };
    addNode(nodeType, position);
    onClose();
  };

  return (
    <div className="absolute top-20 left-4 bg-white rounded-lg shadow-lg border border-gray-200 w-80 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Add Node</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        {nodeTypes.map((nodeType) => {
          const icon = getNodeIcon(nodeType.type);
          
          return (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(e) => handleDragStart(e, nodeType.type)}
              onClick={() => handleAddNode(nodeType.type)}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all"
            >
              <div className={`p-2 rounded-lg ${
                nodeType.type === 'trigger' ? 'bg-green-100 text-green-600' :
                nodeType.type === 'condition' ? 'bg-amber-100 text-amber-600' :
                nodeType.type === 'action' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <span>{icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{nodeType.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{nodeType.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};