import { z } from 'zod';
import { 
  ModuleType, 
  NodeType, 
  TriggerType, 
  ComparisonOperator, 
  ActionType 
} from '../types/workflow.types';

// Base schemas
export const moduleTypeSchema = z.enum(['broker', 'carrier', 'shipper'] as const);
export const nodeTypeSchema = z.enum(['trigger', 'condition', 'action', 'delay'] as const);

// Trigger schemas
export const triggerTypeSchema = z.enum([
  'load_created',
  'load_status_changed',
  'carrier_assigned',
  'payment_received',
  'pod_uploaded',
  'rate_negotiated',
  'new_load_posted',
  'driver_assigned',
  'pickup_confirmed',
  'delivery_completed',
  'driver_checkin',
  'shipment_ready',
  'inventory_low',
  'warehouse_capacity_alert',
  'order_received',
  'dock_appointment_scheduled'
] as const);

export const triggerConfigSchema = z.record(z.union([z.string(), z.number(), z.boolean()])).optional();

export const triggerNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
  moduleType: moduleTypeSchema,
  isConfigured: z.boolean(),
  triggerType: triggerTypeSchema,
  triggerConfig: triggerConfigSchema
});

// Condition schemas
export const comparisonOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'greater_than_or_equals',
  'less_than_or_equals',
  'is_empty',
  'is_not_empty'
] as const);

export const conditionSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  operator: comparisonOperatorSchema,
  value: z.union([z.string(), z.number(), z.boolean(), z.null()])
});

export const conditionNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
  moduleType: moduleTypeSchema,
  isConfigured: z.boolean(),
  conditions: z.array(conditionSchema).min(1, 'At least one condition is required'),
  logicalOperator: z.enum(['AND', 'OR'])
});

// Action schemas
export const actionTypeSchema = z.enum([
  'send_email',
  'send_sms',
  'send_notification',
  'create_alert',
  'update_status',
  'update_field',
  'assign_resource',
  'create_task',
  'create_follow_up',
  'schedule_appointment',
  'webhook',
  'api_call',
  'export_data'
] as const);

export const actionConfigSchema = z.record(z.union([z.string(), z.number(), z.boolean()])).optional();

export const actionNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
  moduleType: moduleTypeSchema,
  isConfigured: z.boolean(),
  actionType: actionTypeSchema,
  actionConfig: actionConfigSchema
});

// Delay schemas
export const delayNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
  moduleType: moduleTypeSchema,
  isConfigured: z.boolean(),
  delayType: z.enum(['fixed', 'until_date', 'business_hours']),
  delayAmount: z.number().positive().optional(),
  delayUnit: z.enum(['minutes', 'hours', 'days']).optional(),
  untilDate: z.string().optional(),
  businessHoursOnly: z.boolean().optional()
});

// Workflow validation
export const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required').max(100),
  description: z.string().max(500).optional(),
  moduleType: moduleTypeSchema,
  isActive: z.boolean().default(false),
  isDraft: z.boolean().default(true)
});

// Email action config schema
export const emailActionConfigSchema = z.object({
  to: z.string().email('Invalid email address'),
  cc: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  template: z.string().optional()
});

// SMS action config schema
export const smsActionConfigSchema = z.object({
  to: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  message: z.string().min(1, 'Message is required').max(160, 'Message too long')
});

// Update field action config schema
export const updateFieldActionConfigSchema = z.object({
  entity: z.string().min(1, 'Entity is required'),
  field: z.string().min(1, 'Field is required'),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()])
});

// Webhook action config schema
export const webhookActionConfigSchema = z.object({
  url: z.string().url('Invalid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  headers: z.record(z.string()).optional(),
  body: z.union([z.string(), z.record(z.unknown())]).optional()
});

// Helper function to validate node data based on type
export function validateNodeData(nodeType: NodeType, data: unknown) {
  switch (nodeType) {
    case 'trigger':
      return triggerNodeSchema.parse(data);
    case 'condition':
      return conditionNodeSchema.parse(data);
    case 'action':
      return actionNodeSchema.parse(data);
    case 'delay':
      return delayNodeSchema.parse(data);
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }
}

// Helper function to validate action config based on action type
export function validateActionConfig(actionType: ActionType, config: unknown) {
  switch (actionType) {
    case 'send_email':
      return emailActionConfigSchema.parse(config);
    case 'send_sms':
      return smsActionConfigSchema.parse(config);
    case 'update_field':
      return updateFieldActionConfigSchema.parse(config);
    case 'webhook':
      return webhookActionConfigSchema.parse(config);
    default:
      return actionConfigSchema.parse(config);
  }
}