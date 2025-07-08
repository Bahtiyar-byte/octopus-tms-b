import { WorkflowTemplate } from '../types/workflow.types';

export const shipperWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'shipper_inventory_alert',
    name: 'Low Inventory Alert',
    description: 'Alert when inventory falls below threshold',
    moduleType: 'shipper',
    category: 'Inventory Management',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Inventory Check',
          triggerType: 'inventory_low',
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'condition_1',
        type: 'condition',
        position: { x: 250, y: 150 },
        data: {
          label: 'Check Critical Level',
          conditions: [{
            field: 'inventory.percentage',
            operator: 'less_than',
            value: 20
          }],
          logicalOperator: 'AND',
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 150, y: 250 },
        data: {
          label: 'Alert Warehouse Manager',
          actionType: 'send_email',
          actionConfig: {
            to: '{{warehouse.manager.email}}',
            subject: 'Critical Inventory Alert - {{inventory.product}}',
            body: 'Inventory for {{inventory.product}} is at {{inventory.percentage}}%. Immediate reorder required.'
          },
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 350, y: 250 },
        data: {
          label: 'Create Reorder Task',
          actionType: 'create_task',
          actionConfig: {
            title: 'Reorder {{inventory.product}} - Critical Low',
            assignTo: 'procurement',
            priority: 'urgent'
          },
          moduleType: 'shipper',
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
  },
  {
    id: 'shipper_shipment_ready',
    name: 'Shipment Ready Notification',
    description: 'Notify carriers when shipment is ready for pickup',
    moduleType: 'shipper',
    category: 'Shipping Operations',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Shipment Ready',
          triggerType: 'shipment_ready',
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 250, y: 150 },
        data: {
          label: 'Notify Assigned Carrier',
          actionType: 'send_email',
          actionConfig: {
            to: '{{carrier.dispatcher.email}}',
            subject: 'Shipment Ready for Pickup - #{{shipment.number}}',
            body: 'Shipment #{{shipment.number}} is ready for pickup at {{warehouse.address}}. Dock door: {{shipment.dockDoor}}'
          },
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 250, y: 250 },
        data: {
          label: 'Update Shipment Status',
          actionType: 'update_status',
          actionConfig: {
            entity: 'shipment',
            value: 'ready_for_pickup'
          },
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'delay_1',
        type: 'delay',
        position: { x: 250, y: 350 },
        data: {
          label: 'Wait 2 Hours',
          delayType: 'fixed',
          delayAmount: 2,
          delayUnit: 'hours',
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'condition_1',
        type: 'condition',
        position: { x: 250, y: 450 },
        data: {
          label: 'Check Pickup Status',
          conditions: [{
            field: 'shipment.status',
            operator: 'not_equals',
            value: 'picked_up'
          }],
          logicalOperator: 'AND',
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'action_3',
        type: 'action',
        position: { x: 250, y: 550 },
        data: {
          label: 'Send Reminder',
          actionType: 'send_sms',
          actionConfig: {
            to: '{{carrier.driver.phone}}',
            message: 'Reminder: Shipment #{{shipment.number}} awaiting pickup at dock {{shipment.dockDoor}}'
          },
          moduleType: 'shipper',
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
        id: 'edge_action_1_action_2',
        source: 'action_1',
        target: 'action_2',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_action_2_delay_1',
        source: 'action_2',
        target: 'delay_1',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_delay_1_condition_1',
        source: 'delay_1',
        target: 'condition_1',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'edge_condition_1_action_3',
        source: 'condition_1',
        sourceHandle: 'true',
        target: 'action_3',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'shipper_dock_appointment',
    name: 'Dock Appointment Management',
    description: 'Manage dock appointments and notifications',
    moduleType: 'shipper',
    category: 'Warehouse Operations',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Appointment Scheduled',
          triggerType: 'dock_appointment_scheduled',
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 250, y: 150 },
        data: {
          label: 'Confirm Appointment',
          actionType: 'send_email',
          actionConfig: {
            to: '{{carrier.email}}',
            subject: 'Dock Appointment Confirmed',
            body: 'Your dock appointment for {{appointment.date}} at {{appointment.time}} has been confirmed. Dock door: {{appointment.dockDoor}}'
          },
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'delay_1',
        type: 'delay',
        position: { x: 250, y: 250 },
        data: {
          label: 'Wait Until Day Before',
          delayType: 'until_date',
          untilDate: '{{appointment.date - 1 day}}',
          moduleType: 'shipper',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 250, y: 350 },
        data: {
          label: 'Send Reminder',
          actionType: 'send_notification',
          actionConfig: {
            title: 'Appointment Reminder',
            message: 'Dock appointment tomorrow at {{appointment.time}} for {{carrier.name}}',
            type: 'info'
          },
          moduleType: 'shipper',
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
  }
];