import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { nodeColors, getNodeIcon } from '../../utils/nodeHelpers';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const ConditionNode: React.FC<NodeProps> = ({ 
  data, 
  selected 
}) => {
  const { background, border, text } = nodeColors.condition;
  const icon = getNodeIcon('condition');
  
  // Type assertion for data
  const nodeData = data as any;

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg border-2 transition-all ${
        selected ? 'ring-4 ring-amber-300' : ''
      }`}
      style={{
        backgroundColor: background,
        borderColor: selected ? border : 'transparent',
        color: text,
        minWidth: '200px'
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2"
        style={{ borderColor: border }}
      />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{nodeData.label}</span>
            <span className="text-xs opacity-80">
              {nodeData.conditions.length} condition{nodeData.conditions.length !== 1 ? 's' : ''}
              {nodeData.conditions.length > 1 && ` (${nodeData.logicalOperator})`}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {nodeData.isConfigured && nodeData.conditions.length > 0 ? (
            <CheckCircle size={16} className="text-white" />
          ) : (
            <AlertCircle size={16} className="text-yellow-200" />
          )}
        </div>
      </div>
      
      {nodeData.description && (
        <p className="text-xs mt-2 opacity-80">{nodeData.description}</p>
      )}

      <div className="flex justify-around mt-3">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 bg-white border-2"
          style={{ 
            borderColor: border,
            left: '30%'
          }}
        >
          <span className="absolute -bottom-5 text-xs text-gray-600 -left-2">True</span>
        </Handle>
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 bg-white border-2"
          style={{ 
            borderColor: border,
            left: '70%'
          }}
        >
          <span className="absolute -bottom-5 text-xs text-gray-600 -left-3">False</span>
        </Handle>
      </div>
    </div>
  );
};