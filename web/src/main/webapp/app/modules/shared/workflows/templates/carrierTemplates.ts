import { WorkflowTemplate } from '../types/workflow.types';

export const carrierWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'carrier_driver_assignment',
    name: 'Driver Assignment Notification',
    description: 'Notify driver when assigned to a new load',
    moduleType: 'carrier',
    category: 'Driver Management',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Driver Assigned',
          triggerType: 'driver_assigned',
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 150, y: 150 },
        data: {
          label: 'Send SMS to Driver',
          actionType: 'send_sms',
          actionConfig: {
            to: '{{driver.phone}}',
            message: 'New load assigned: {{load.origin}} to {{load.destination}}. Pickup: {{load.pickupDate}}'
          },
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 350, y: 150 },
        data: {
          label: 'Update Load Status',
          actionType: 'update_status',
          actionConfig: {
            entity: 'load',
            value: 'assigned'
          },
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'action_3',
        type: 'action',
        position: { x: 250, y: 250 },
        data: {
          label: 'Create Dispatch Notes',
          actionType: 'create_task',
          actionConfig: {
            title: 'Dispatch load #{{load.number}} to {{driver.name}}',
            assignTo: 'dispatcher'
          },
          moduleType: 'carrier',
          isConfigured: true
        }
      }
    ],
    edges: [
      {
        id: 'edge_trigger_1_action_1',
        source: 'trigger_1',
        target: 'action_1',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_trigger_1_action_2',
        source: 'trigger_1',
        target: 'action_2',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_action_1_action_3',
        source: 'action_1',
        target: 'action_3',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'carrier_delivery_confirmation',
    name: 'Delivery Confirmation Flow',
    description: 'Automate delivery confirmation and invoicing',
    moduleType: 'carrier',
    category: 'Operations',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Delivery Completed',
          triggerType: 'delivery_completed',
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 250, y: 150 },
        data: {
          label: 'Notify Broker',
          actionType: 'send_email',
          actionConfig: {
            to: '{{broker.email}}',
            subject: 'Delivery Confirmation - Load #{{load.number}}',
            body: 'Load #{{load.number}} has been successfully delivered to {{load.destination}}.'
          },
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'delay_1',
        type: 'delay',
        position: { x: 250, y: 250 },
        data: {
          label: 'Wait 1 Hour',
          delayType: 'fixed',
          delayAmount: 1,
          delayUnit: 'hours',
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 250, y: 350 },
        data: {
          label: 'Generate Invoice',
          actionType: 'create_task',
          actionConfig: {
            title: 'Generate invoice for load #{{load.number}}',
            assignTo: 'billing',
            priority: 'high'
          },
          moduleType: 'carrier',
          isConfigured: true
        }
      }
    ],
    edges: [
      {
        id: 'edge_trigger_1_action_1',
        source: 'trigger_1',
        target: 'action_1',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_action_1_delay_1',
        source: 'action_1',
        target: 'delay_1',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_delay_1_action_2',
        source: 'delay_1',
        target: 'action_2',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'carrier_hos_alert',
    name: 'Hours of Service Alert',
    description: 'Alert when driver is approaching HOS limits',
    moduleType: 'carrier',
    category: 'Compliance',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Driver Check-in',
          triggerType: 'driver_checkin',
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'condition_1',
        type: 'condition',
        position: { x: 250, y: 150 },
        data: {
          label: 'Check HOS Remaining',
          conditions: [{
            field: 'driver.hoursOfService',
            operator: 'less_than',
            value: 2
          }],
          logicalOperator: 'AND',
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 150, y: 250 },
        data: {
          label: 'Alert Driver',
          actionType: 'send_notification',
          actionConfig: {
            title: 'HOS Warning',
            message: 'You have less than 2 hours remaining. Plan your rest break.',
            type: 'warning'
          },
          moduleType: 'carrier',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 350, y: 250 },
        data: {
          label: 'Notify Dispatcher',
          actionType: 'create_alert',
          actionConfig: {
            title: 'Driver {{driver.name}} approaching HOS limit',
            message: 'Driver has {{driver.hoursOfService}} hours remaining',
            type: 'warning'
          },
          moduleType: 'carrier',
          isConfigured: true
        }
      }
    ],
    edges: [
      {
        id: 'edge_trigger_1_condition_1',
        source: 'trigger_1',
        target: 'condition_1',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_condition_1_action_1',
        source: 'condition_1',
        sourceHandle: 'true',
        target: 'action_1',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_condition_1_action_2',
        source: 'condition_1',
        sourceHandle: 'true',
        target: 'action_2',
        type: 'smoothstep',
        animated: true
      }
    ]
  }
];