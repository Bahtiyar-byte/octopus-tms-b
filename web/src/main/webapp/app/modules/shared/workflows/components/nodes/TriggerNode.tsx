import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { nodeColors, getNodeIcon, getTriggerDisplayName } from '../../utils/nodeHelpers';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const TriggerNode: React.FC<NodeProps> = ({ 
  data, 
  selected 
}) => {
  const { background, border, text } = nodeColors.trigger;
  const icon = getNodeIcon('trigger');
  
  // Type assertion for data
  const nodeData = data as any;

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg border-2 transition-all ${
        selected ? 'ring-4 ring-green-300' : ''
      }`}
      style={{
        backgroundColor: background,
        borderColor: selected ? border : 'transparent',
        color: text,
        minWidth: '200px'
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{nodeData.label}</span>
            <span className="text-xs opacity-80">
              {getTriggerDisplayName(nodeData.triggerType)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {nodeData.isConfigured ? (
            <CheckCircle size={16} className="text-white" />
          ) : (
            <AlertCircle size={16} className="text-yellow-200" />
          )}
        </div>
      </div>
      
      {nodeData.description && (
        <p className="text-xs mt-2 opacity-80">{nodeData.description}</p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2"
        style={{ borderColor: border }}
      />
    </div>
  );
};