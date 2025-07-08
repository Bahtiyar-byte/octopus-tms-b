import { Node, Edge } from '@xyflow/react';

// Base node data structure
export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  moduleType: ModuleType;
  isConfigured: boolean;
}

// Module types
export type ModuleType = 'broker' | 'carrier' | 'shipper';

// Node types
export type NodeType = 'trigger' | 'condition' | 'action' | 'delay';

// Trigger node specific data
export interface TriggerNodeData extends BaseNodeData {
  triggerType: TriggerType;
  triggerConfig?: TriggerConfig;
}

export type TriggerType = 
  // Broker triggers
  | 'load_created'
  | 'load_status_changed'
  | 'carrier_assigned'
  | 'payment_received'
  | 'pod_uploaded'
  | 'rate_negotiated'
  // Carrier triggers
  | 'new_load_posted'
  | 'driver_assigned'
  | 'pickup_confirmed'
  | 'delivery_completed'
  | 'driver_checkin'
  // Shipper triggers
  | 'shipment_ready'
  | 'inventory_low'
  | 'warehouse_capacity_alert'
  | 'order_received'
  | 'dock_appointment_scheduled';

export interface TriggerConfig {
  [key: string]: any;
}

// Condition node specific data
export interface ConditionNodeData extends BaseNodeData {
  conditions: Condition[];
  logicalOperator: 'AND' | 'OR';
}

export interface Condition {
  field: string;
  operator: ComparisonOperator;
  value: any;
}

export type ComparisonOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equals'
  | 'less_than_or_equals'
  | 'is_empty'
  | 'is_not_empty';

// Action node specific data
export interface ActionNodeData extends BaseNodeData {
  actionType: ActionType;
  actionConfig?: ActionConfig;
}

export type ActionType = 
  // Communication actions
  | 'send_email'
  | 'send_sms'
  | 'send_notification'
  | 'create_alert'
  // Data update actions
  | 'update_status'
  | 'update_field'
  | 'assign_resource'
  // Task actions
  | 'create_task'
  | 'create_follow_up'
  | 'schedule_appointment'
  // Integration actions
  | 'webhook'
  | 'api_call'
  | 'export_data';

export interface ActionConfig {
  [key: string]: any;
}

// Delay node specific data
export interface DelayNodeData extends BaseNodeData {
  delayType: 'fixed' | 'until_date' | 'business_hours';
  delayAmount?: number;
  delayUnit?: 'minutes' | 'hours' | 'days';
  untilDate?: string;
  businessHoursOnly?: boolean;
}

// Custom node types
export type TriggerNode = Node<TriggerNodeData, 'trigger'>;
export type ConditionNode = Node<ConditionNodeData, 'condition'>;
export type ActionNode = Node<ActionNodeData, 'action'>;
export type DelayNode = Node<DelayNodeData, 'delay'>;

export type WorkflowNode = TriggerNode | ConditionNode | ActionNode | DelayNode;

// Workflow definition
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  moduleType: ModuleType;
  isActive: boolean;
  isDraft: boolean;
  nodes: WorkflowNode[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
}

// Workflow template
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  moduleType: ModuleType;
  category: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  thumbnail?: string;
}

// Node configuration forms
export interface NodeConfigFormData {
  trigger?: TriggerConfig;
  condition?: ConditionNodeData['conditions'];
  action?: ActionConfig;
  delay?: {
    delayType: DelayNodeData['delayType'];
    delayAmount?: number;
    delayUnit?: DelayNodeData['delayUnit'];
    untilDate?: string;
    businessHoursOnly?: boolean;
  };
}

// Workflow execution
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startedAt: string;
  completedAt?: string;
  currentNodeId?: string;
  executionPath: string[];
  context: Record<string, any>;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  nodeId: string;
  timestamp: string;
  status: 'started' | 'completed' | 'failed' | 'skipped';
  message?: string;
  data?: any;
}