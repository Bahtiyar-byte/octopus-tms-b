import { create } from 'zustand';
import { Node, Edge, Connection, addEdge } from '@xyflow/react';
import { 
  WorkflowNode, 
  NodeType, 
  ModuleType,
  Workflow
} from '../types/workflow.types';
import { 
  createNode, 
  isValidConnection,
  generateEdgeId 
} from '../utils/nodeHelpers';

interface WorkflowState {
  // Current workflow
  currentWorkflow: Workflow | null;
  
  // Nodes and edges
  nodes: Node[];
  edges: Edge[];
  
  // UI state
  selectedNodeId: string | null;
  isPanelOpen: boolean;
  moduleType: ModuleType;
  
  // Actions
  setModuleType: (moduleType: ModuleType) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, data: Partial<Node['data']>) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onConnect: (connection: Connection) => void;
  deleteEdge: (edgeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  togglePanel: () => void;
  clearWorkflow: () => void;
  loadWorkflow: (workflow: Workflow) => void;
  saveWorkflow: (name: string, description?: string) => Workflow;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  currentWorkflow: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isPanelOpen: false,
  moduleType: 'broker',

  // Actions
  setModuleType: (moduleType) => set({ moduleType }),

  addNode: (type, position) => {
    const { nodes, moduleType } = get();
    const newNode = createNode(type, position, moduleType);
    set({ 
      nodes: [...nodes, newNode],
      selectedNodeId: newNode.id,
      isPanelOpen: true
    });
  },

  updateNode: (nodeId, data) => {
    const { nodes } = get();
    const updatedNodes = nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...data } }
        : node
    );
    set({ nodes: updatedNodes });
  },

  deleteNode: (nodeId) => {
    const { nodes, edges, selectedNodeId } = get();
    const filteredNodes = nodes.filter(node => node.id !== nodeId);
    const filteredEdges = edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    set({ 
      nodes: filteredNodes, 
      edges: filteredEdges,
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
      isPanelOpen: false
    });
  },

  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),

  onConnect: (connection) => {
    const { edges, nodes } = get();
    
    if (!connection.source || !connection.target) return;
    
    if (!isValidConnection(connection, nodes)) {
      console.warn('Invalid connection attempted');
      return;
    }

    const newEdge = {
      ...connection,
      id: generateEdgeId(connection.source, connection.target),
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#94a3b8' }
    } as Edge;

    set({ edges: addEdge(newEdge, edges) });
  },

  deleteEdge: (edgeId) => {
    const { edges } = get();
    set({ edges: edges.filter(edge => edge.id !== edgeId) });
  },

  selectNode: (nodeId) => {
    set({ 
      selectedNodeId: nodeId,
      isPanelOpen: nodeId !== null
    });
  },

  togglePanel: () => {
    const { isPanelOpen } = get();
    set({ isPanelOpen: !isPanelOpen });
  },

  clearWorkflow: () => {
    set({
      currentWorkflow: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isPanelOpen: false
    });
  },

  loadWorkflow: (workflow) => {
    set({
      currentWorkflow: workflow,
      nodes: workflow.nodes,
      edges: workflow.edges,
      moduleType: workflow.moduleType,
      selectedNodeId: null,
      isPanelOpen: false
    });
  },

  saveWorkflow: (name, description) => {
    const { nodes, edges, moduleType } = get();
    const workflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name,
      description,
      moduleType,
      isActive: false,
      isDraft: true,
      nodes: nodes as WorkflowNode[],
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user', // Would come from auth context
      version: 1
    };
    
    set({ currentWorkflow: workflow });
    return workflow;
  }
}));