import { Node, Edge, Connection, XYPosition } from '@xyflow/react';
import { 
  WorkflowNode, 
  NodeType, 
  ModuleType,
  TriggerNodeData,
  ConditionNodeData,
  ActionNodeData,
  DelayNodeData
} from '../types/workflow.types';

// Node colors based on type
export const nodeColors = {
  trigger: {
    background: '#10b981', // green-500
    border: '#059669', // green-600
    text: '#ffffff'
  },
  condition: {
    background: '#f59e0b', // amber-500
    border: '#d97706', // amber-600
    text: '#ffffff'
  },
  action: {
    background: '#3b82f6', // blue-500
    border: '#2563eb', // blue-600
    text: '#ffffff'
  },
  delay: {
    background: '#8b5cf6', // purple-500
    border: '#7c3aed', // purple-600
    text: '#ffffff'
  }
};

// Generate unique node ID
export const generateNodeId = (type: NodeType): string => {
  return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create default node data based on type
export const createDefaultNodeData = (
  type: NodeType, 
  moduleType: ModuleType
): TriggerNodeData | ConditionNodeData | ActionNodeData | DelayNodeData => {
  const baseData = {
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    moduleType,
    isConfigured: false
  };

  switch (type) {
    case 'trigger':
      return {
        ...baseData,
        triggerType: 'load_created'
      } as TriggerNodeData;
    
    case 'condition':
      return {
        ...baseData,
        conditions: [],
        logicalOperator: 'AND'
      } as ConditionNodeData;
    
    case 'action':
      return {
        ...baseData,
        actionType: 'send_notification'
      } as ActionNodeData;
    
    case 'delay':
      return {
        ...baseData,
        delayType: 'fixed',
        delayAmount: 1,
        delayUnit: 'hours'
      } as DelayNodeData;
    
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
};

// Create a new node
export const createNode = (
  type: NodeType,
  position: XYPosition,
  moduleType: ModuleType
): WorkflowNode => {
  const id = generateNodeId(type);
  const data = createDefaultNodeData(type, moduleType);

  return {
    id,
    type,
    position,
    data
  } as WorkflowNode;
};

// Check if connection is valid
export const isValidConnection = (
  connection: Connection,
  nodes: Node[]
): boolean => {
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  // Triggers can only be sources, not targets
  if (targetNode.type === 'trigger') return false;

  // Actions and delays can't connect to triggers
  if (
    (sourceNode.type === 'action' || sourceNode.type === 'delay') && 
    targetNode.type === 'trigger'
  ) {
    return false;
  }

  return true;
};

// Get node icon based on type
export const getNodeIcon = (type: NodeType): string => {
  switch (type) {
    case 'trigger':
      return '⚡';
    case 'condition':
      return '🔀';
    case 'action':
      return '⚙️';
    case 'delay':
      return '⏱️';
    default:
      return '📦';
  }
};

// Get trigger display name
export const getTriggerDisplayName = (triggerType: string): string => {
  const displayNames: Record<string, string> = {
    // Broker triggers
    load_created: 'Load Created',
    load_status_changed: 'Load Status Changed',
    carrier_assigned: 'Carrier Assigned',
    payment_received: 'Payment Received',
    pod_uploaded: 'POD Uploaded',
    rate_negotiated: 'Rate Negotiated',
    // Carrier triggers
    new_load_posted: 'New Load Posted',
    driver_assigned: 'Driver Assigned',
    pickup_confirmed: 'Pickup Confirmed',
    delivery_completed: 'Delivery Completed',
    driver_checkin: 'Driver Check-in',
    // Shipper triggers
    shipment_ready: 'Shipment Ready',
    inventory_low: 'Inventory Low',
    warehouse_capacity_alert: 'Warehouse Capacity Alert',
    order_received: 'Order Received',
    dock_appointment_scheduled: 'Dock Appointment Scheduled'
  };

  return displayNames[triggerType] || triggerType;
};

// Get action display name
export const getActionDisplayName = (actionType: string): string => {
  const displayNames: Record<string, string> = {
    send_email: 'Send Email',
    send_sms: 'Send SMS',
    send_notification: 'Send Notification',
    create_alert: 'Create Alert',
    update_status: 'Update Status',
    update_field: 'Update Field',
    assign_resource: 'Assign Resource',
    create_task: 'Create Task',
    create_follow_up: 'Create Follow-up',
    schedule_appointment: 'Schedule Appointment',
    webhook: 'Call Webhook',
    api_call: 'API Call',
    export_data: 'Export Data'
  };

  return displayNames[actionType] || actionType;
};

// Validate workflow has at least one trigger
export const validateWorkflowStructure = (nodes: Node[]): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  // Check for at least one trigger
  const triggers = nodes.filter(n => n.type === 'trigger');
  if (triggers.length === 0) {
    errors.push('Workflow must have at least one trigger');
  }

  // Check for at least one action
  const actions = nodes.filter(n => n.type === 'action');
  if (actions.length === 0) {
    errors.push('Workflow must have at least one action');
  }

  // Check all nodes are configured
  const unconfiguredNodes = nodes.filter(n => !n.data.isConfigured);
  if (unconfiguredNodes.length > 0) {
    errors.push(`${unconfiguredNodes.length} node(s) are not configured`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get available triggers for a module
export const getTriggersForModule = (moduleType: ModuleType): string[] => {
  const triggersByModule: Record<ModuleType, string[]> = {
    broker: [
      'load_created',
      'load_status_changed',
      'carrier_assigned',
      'payment_received',
      'pod_uploaded',
      'rate_negotiated'
    ],
    carrier: [
      'new_load_posted',
      'driver_assigned',
      'pickup_confirmed',
      'delivery_completed',
      'driver_checkin'
    ],
    shipper: [
      'shipment_ready',
      'inventory_low',
      'warehouse_capacity_alert',
      'order_received',
      'dock_appointment_scheduled'
    ]
  };

  return triggersByModule[moduleType] || [];
};

// Generate edge ID
export const generateEdgeId = (source: string, target: string): string => {
  return `edge_${source}_${target}`;
};