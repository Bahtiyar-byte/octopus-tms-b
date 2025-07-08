import React from 'react';
import { X } from 'lucide-react';
import { NodeType, ModuleType } from '../types/workflow.types';
import { useWorkflowStore } from '../store/workflowStore';
import { getNodeIcon } from '../utils/nodeHelpers';

interface NodePaletteProps {
  onClose: () => void;
  moduleType: ModuleType;
}

interface NodeTypeItem {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
}

const nodeTypeItems: NodeTypeItem[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Start your workflow with an event',
    icon: getNodeIcon('trigger')
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Add logic to your workflow',
    icon: getNodeIcon('condition')
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Perform an action',
    icon: getNodeIcon('action')
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Add a wait time',
    icon: getNodeIcon('delay')
  }
];

export const NodePalette: React.FC<NodePaletteProps> = ({ onClose, moduleType }) => {
  const { addNode } = useWorkflowStore();

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (nodeType: NodeType) => {
    // Get center of viewport
    const position = {
      x: 250,
      y: 100
    };

    addNode(nodeType, position);
    onClose();
  };

  return (
    <div className="absolute left-4 top-20 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10 w-72">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Add Node</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {nodeTypeItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onClick={() => handleAddNode(item.type)}
            className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                  {item.label}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Drag nodes onto the canvas or click to add them at the center.
        </p>
      </div>
    </div>
  );
};