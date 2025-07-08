import { WorkflowTemplate } from '../types/workflow.types';

export const brokerWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'broker_pod_reminder',
    name: 'POD Upload Reminder',
    description: 'Automatically remind carriers to upload POD after delivery',
    moduleType: 'broker',
    category: 'Document Management',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Load Delivered',
          triggerType: 'load_status_changed',
          triggerConfig: { statusFilter: 'delivered' },
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'delay_1',
        type: 'delay',
        position: { x: 250, y: 150 },
        data: {
          label: 'Wait 24 Hours',
          delayType: 'fixed',
          delayAmount: 24,
          delayUnit: 'hours',
          businessHoursOnly: true,
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'condition_1',
        type: 'condition',
        position: { x: 250, y: 250 },
        data: {
          label: 'Check POD Status',
          conditions: [{
            field: 'load.podUploaded',
            operator: 'equals',
            value: false
          }],
          logicalOperator: 'AND',
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 150, y: 350 },
        data: {
          label: 'Send Email Reminder',
          actionType: 'send_email',
          actionConfig: {
            to: '{{carrier.email}}',
            subject: 'POD Upload Reminder - Load #{{load.number}}',
            body: 'Please upload the POD for load #{{load.number}} delivered to {{load.destination}}.'
          },
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 350, y: 350 },
        data: {
          label: 'Create Follow-up Task',
          actionType: 'create_task',
          actionConfig: {
            title: 'Follow up on POD - Load #{{load.number}}',
            assignTo: '{{broker.id}}',
            priority: 'high'
          },
          moduleType: 'broker',
          isConfigured: true
        }
      }
    ],
    edges: [
      {
        id: 'edge_trigger_1_delay_1',
        source: 'trigger_1',
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
    id: 'broker_rate_negotiation',
    name: 'Rate Negotiation Alert',
    description: 'Alert when carrier rate exceeds budget threshold',
    moduleType: 'broker',
    category: 'Rate Management',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Rate Negotiated',
          triggerType: 'rate_negotiated',
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'condition_1',
        type: 'condition',
        position: { x: 250, y: 150 },
        data: {
          label: 'Check Rate Threshold',
          conditions: [{
            field: 'load.rate',
            operator: 'greater_than',
            value: '{{load.budgetRate * 1.1}}'
          }],
          logicalOperator: 'AND',
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 250, y: 250 },
        data: {
          label: 'Alert Supervisor',
          actionType: 'send_notification',
          actionConfig: {
            title: 'Rate Exceeds Budget',
            message: 'Load #{{load.number}} rate of ${{load.rate}} exceeds budget by {{(load.rate - load.budgetRate) / load.budgetRate * 100}}%',
            type: 'warning'
          },
          moduleType: 'broker',
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
      }
    ]
  },
  {
    id: 'broker_carrier_onboarding',
    name: 'Carrier Onboarding',
    description: 'Automate new carrier onboarding process',
    moduleType: 'broker',
    category: 'Carrier Management',
    nodes: [
      {
        id: 'trigger_1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
          label: 'Carrier Created',
          triggerType: 'carrier_assigned',
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'action_1',
        type: 'action',
        position: { x: 250, y: 150 },
        data: {
          label: 'Send Welcome Email',
          actionType: 'send_email',
          actionConfig: {
            to: '{{carrier.email}}',
            subject: 'Welcome to Our Network!',
            body: 'Welcome {{carrier.name}}! Please complete your profile and upload required documents.'
          },
          moduleType: 'broker',
          isConfigured: true
        }
      },
      {
        id: 'action_2',
        type: 'action',
        position: { x: 250, y: 250 },
        data: {
          label: 'Create Onboarding Tasks',
          actionType: 'create_task',
          actionConfig: {
            title: 'Complete carrier onboarding for {{carrier.name}}',
            tasks: ['Verify insurance', 'Check MC authority', 'Set up payment terms']
          },
          moduleType: 'broker',
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
      }
    ]
  }
];