import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Plus, 
  Save, 
  Play, 
  Trash2, 
  FileText,
  Settings,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useWorkflowStore } from '../store/workflowStore';
import { NodeType, Workflow } from '../types/workflow.types';
import { validateWorkflowStructure } from '../utils/nodeHelpers';
import { 
  TriggerNode,
  ConditionNode,
  ActionNode,
  DelayNode
} from './nodes';
import { UnifiedNodePalette } from './UnifiedNodePalette';
import { NodeConfigPanel } from './panels/NodeConfigPanel';

// Define custom node types
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  delay: DelayNode,
};

interface UnifiedWorkflowBuilderProps {
  templateId?: string | null;
  workflowId?: string | null;
  onSave?: (workflow: Workflow) => void;
  onTest?: (workflow: { nodes: Node[]; edges: Edge[] }) => void;
  onSaveSuccess?: () => void;
}

const WorkflowBuilderContent: React.FC<UnifiedWorkflowBuilderProps> = ({ 
  templateId,
  workflowId,
  onSave,
  onTest,
  onSaveSuccess 
}) => {
  const reactFlowInstance = useReactFlow();
  const [showPalette, setShowPalette] = useState(false);
  
  const {
    nodes,
    edges,
    selectedNodeId,
    isPanelOpen,
    setNodes,
    setEdges,
    onConnect,
    selectNode,
    deleteNode,
    saveWorkflow,
    clearWorkflow,
  } = useWorkflowStore();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
    },
    [edges, setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleSave = () => {
    const validation = validateWorkflowStructure(nodes);
    
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '));
      return;
    }

    const workflowName = prompt('Enter workflow name:');
    if (!workflowName) return;

    const workflow = saveWorkflow(workflowName);
    
    if (onSave) {
      onSave(workflow);
    }
    
    toast.success('Workflow saved successfully!');
    
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  const handleTest = () => {
    const validation = validateWorkflowStructure(nodes);
    
    if (!validation.isValid) {
      toast.error(validation.errors.join(', '));
      return;
    }

    if (onTest) {
      onTest({ nodes, edges });
    }
    
    toast.success('Workflow test started!');
  };

  const handleClear = () => {
    if (nodes.length === 0) return;
    
    if (confirm('Are you sure you want to clear the workflow?')) {
      clearWorkflow();
      toast.success('Workflow cleared');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
      toast.success('Node deleted');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Workflow Builder</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="btn btn-ghost flex items-center gap-2"
              disabled={nodes.length === 0}
            >
              <X size={20} />
              Clear
            </button>
            <button
              onClick={handleTest}
              className="btn btn-secondary flex items-center gap-2"
              disabled={nodes.length === 0}
            >
              <Play size={20} />
              Test
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary flex items-center gap-2"
              disabled={nodes.length === 0}
            >
              <Save size={20} />
              Save Workflow
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-100"
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'trigger': return '#10b981';
                case 'condition': return '#f59e0b';
                case 'action': return '#3b82f6';
                case 'delay': return '#8b5cf6';
                default: return '#6b7280';
              }
            }}
            className="bg-white border border-gray-300"
          />
          
          <Panel position="top-left">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Node
            </button>
          </Panel>

          <Panel position="top-right">
            <div className="flex gap-2">
              {selectedNodeId && (
                <button
                  onClick={handleDeleteSelected}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              )}
            </div>
          </Panel>
        </ReactFlow>

        {showPalette && (
          <UnifiedNodePalette 
            onClose={() => setShowPalette(false)}
          />
        )}

        {isPanelOpen && selectedNodeId && (
          <NodeConfigPanel nodeId={selectedNodeId} />
        )}
      </div>
    </div>
  );
};

export const UnifiedWorkflowBuilder: React.FC<UnifiedWorkflowBuilderProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent {...props} />
    </ReactFlowProvider>
  );
};