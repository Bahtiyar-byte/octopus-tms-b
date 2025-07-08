import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { nodeColors, getNodeIcon } from '../../utils/nodeHelpers';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const DelayNode: React.FC<NodeProps> = ({ 
  data, 
  selected 
}) => {
  const { background, border, text } = nodeColors.delay;
  const icon = getNodeIcon('delay');
  
  // Type assertion for data
  const nodeData = data as any;

  const getDelayDescription = () => {
    if (nodeData.delayType === 'fixed' && nodeData.delayAmount && nodeData.delayUnit) {
      return `Wait ${nodeData.delayAmount} ${nodeData.delayUnit}`;
    } else if (nodeData.delayType === 'until_date' && nodeData.untilDate) {
      return `Wait until ${new Date(nodeData.untilDate).toLocaleDateString()}`;
    } else if (nodeData.delayType === 'business_hours') {
      return 'Wait for business hours';
    }
    return 'Not configured';
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg border-2 transition-all ${
        selected ? 'ring-4 ring-purple-300' : ''
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
              {getDelayDescription()}
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

      {nodeData.businessHoursOnly && (
        <div className="mt-2 text-xs bg-white/20 px-2 py-1 rounded">
          Business hours only
        </div>
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