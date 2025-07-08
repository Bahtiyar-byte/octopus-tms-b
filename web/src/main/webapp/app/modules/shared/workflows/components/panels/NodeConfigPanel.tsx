import React from 'react';
import { X } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { TriggerConfigPanel } from './TriggerConfigPanel';
import { ConditionConfigPanel } from './ConditionConfigPanel';
import { ActionConfigPanel } from './ActionConfigPanel';
import { DelayConfigPanel } from './DelayConfigPanel';

interface NodeConfigPanelProps {
  nodeId: string;
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ nodeId }) => {
  const { nodes, selectNode } = useWorkflowStore();
  const node = nodes.find(n => n.id === nodeId);

  if (!node) return null;

  const renderConfigPanel = () => {
    switch (node.type) {
      case 'trigger':
        return <TriggerConfigPanel node={node as any} />;
      case 'condition':
        return <ConditionConfigPanel node={node as any} />;
      case 'action':
        return <ActionConfigPanel node={node as any} />;
      case 'delay':
        return <DelayConfigPanel node={node as any} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  const getNodeTypeLabel = () => {
    return node.type ? node.type.charAt(0).toUpperCase() + node.type.slice(1) : '';
  };

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 z-20 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Configure {getNodeTypeLabel()}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {(node.data as any).label}
            </p>
          </div>
          <button
            onClick={() => selectNode(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {renderConfigPanel()}
      </div>
    </div>
  );
};