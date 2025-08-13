import React from 'react';
import { Node } from '@xyflow/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ActionNodeData, ActionType } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { actionNodeSchema, emailActionConfigSchema, smsActionConfigSchema } from '../../utils/validation';
import { getActionDisplayName } from '../../utils/nodeHelpers';
import { toast } from 'react-hot-toast';

interface ActionConfigPanelProps {
  node: Node<ActionNodeData>;
}

const formSchema = actionNodeSchema.extend({
  // Email fields
  emailTo: z.string().optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  // SMS fields
  smsTo: z.string().optional(),
  smsMessage: z.string().optional(),
  // Notification fields
  notificationTitle: z.string().optional(),
  notificationMessage: z.string().optional(),
  notificationType: z.enum(['info', 'success', 'warning', 'error']).optional(),
  // Update fields
  updateEntity: z.string().optional(),
  updateField: z.string().optional(),
  updateValue: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type ActionConfig = 
  | { to: string | undefined; subject: string | undefined; body: string | undefined }
  | { to: string | undefined; message: string | undefined }
  | { title: string | undefined; message: string | undefined; type: 'info' | 'success' | 'warning' | 'error' }
  | { entity: string | undefined; field: string | undefined; value: string | undefined };

const actionTypes: ActionType[] = [
  'send_email',
  'send_sms',
  'send_notification',
  'create_alert',
  'update_status',
  'update_field',
  'create_task',
  'create_follow_up'
];

export const ActionConfigPanel: React.FC<ActionConfigPanelProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: node.data.label,
      description: node.data.description || '',
      actionType: node.data.actionType,
      moduleType: node.data.moduleType,
      isConfigured: node.data.isConfigured,
      ...(node.data.actionConfig || {})
    }
  });

  const selectedActionType = watch('actionType');

  const onSubmit = (data: FormData) => {
    const { 
      emailTo, emailSubject, emailBody,
      smsTo, smsMessage,
      notificationTitle, notificationMessage, notificationType,
      updateEntity, updateField, updateValue,
      ...nodeData 
    } = data;
    
    let actionConfig: ActionConfig | {} = {};
    
    // Build config based on action type
    switch (selectedActionType) {
      case 'send_email':
        actionConfig = {
          to: emailTo,
          subject: emailSubject,
          body: emailBody
        };
        break;
      case 'send_sms':
        actionConfig = {
          to: smsTo,
          message: smsMessage
        };
        break;
      case 'send_notification':
      case 'create_alert':
        actionConfig = {
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType || 'info'
        };
        break;
      case 'update_status':
      case 'update_field':
        actionConfig = {
          entity: updateEntity,
          field: updateField,
          value: updateValue
        };
        break;
    }

    updateNode(node.id, {
      ...nodeData,
      actionConfig: Object.keys(actionConfig).length > 0 ? actionConfig : undefined,
      isConfigured: true
    });

    toast.success('Action configuration saved!');
  };

  const renderActionFields = () => {
    switch (selectedActionType) {
      case 'send_email':
        return (
          <>
            <div>
              <label className="form-label">To Email</label>
              <input
                type="email"
                {...register('emailTo')}
                className="form-control"
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input
                type="text"
                {...register('emailSubject')}
                className="form-control"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="form-label">Body</label>
              <textarea
                {...register('emailBody')}
                className="form-control"
                rows={4}
                placeholder="Email body content..."
              />
            </div>
          </>
        );

      case 'send_sms':
        return (
          <>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                {...register('smsTo')}
                className="form-control"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea
                {...register('smsMessage')}
                className="form-control"
                rows={3}
                maxLength={160}
                placeholder="SMS message (max 160 chars)"
              />
            </div>
          </>
        );

      case 'send_notification':
      case 'create_alert':
        return (
          <>
            <div>
              <label className="form-label">Title</label>
              <input
                type="text"
                {...register('notificationTitle')}
                className="form-control"
                placeholder="Notification title"
              />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea
                {...register('notificationMessage')}
                className="form-control"
                rows={3}
                placeholder="Notification message"
              />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select
                {...register('notificationType')}
                className="form-select"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </>
        );

      case 'update_status':
        return (
          <>
            <div>
              <label className="form-label">Entity</label>
              <select
                {...register('updateEntity')}
                className="form-select"
              >
                <option value="">Select entity...</option>
                <option value="load">Load</option>
                <option value="shipment">Shipment</option>
                <option value="carrier">Carrier</option>
                <option value="driver">Driver</option>
              </select>
            </div>
            <div>
              <label className="form-label">New Status</label>
              <select
                {...register('updateValue')}
                className="form-select"
              >
                <option value="">Select status...</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </>
        );

      case 'update_field':
        return (
          <>
            <div>
              <label className="form-label">Entity</label>
              <select
                {...register('updateEntity')}
                className="form-select"
              >
                <option value="">Select entity...</option>
                <option value="load">Load</option>
                <option value="shipment">Shipment</option>
                <option value="carrier">Carrier</option>
                <option value="driver">Driver</option>
              </select>
            </div>
            <div>
              <label className="form-label">Field</label>
              <input
                type="text"
                {...register('updateField')}
                className="form-control"
                placeholder="e.g., priority, notes"
              />
            </div>
            <div>
              <label className="form-label">New Value</label>
              <input
                type="text"
                {...register('updateValue')}
                className="form-control"
                placeholder="New value"
              />
            </div>
          </>
        );

      case 'create_task':
      case 'create_follow_up':
        return (
          <div>
            <label className="form-label">Task Description</label>
            <textarea
              {...register('notificationMessage')}
              className="form-control"
              rows={3}
              placeholder="Describe the task or follow-up..."
            />
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-sm">
            Configuration for this action type is coming soon.
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div>
        <label className="form-label">Node Label</label>
        <input
          type="text"
          {...register('label')}
          className="form-control"
          placeholder="Enter a descriptive label"
        />
        {errors.label && (
          <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>
        )}
      </div>

      <div>
        <label className="form-label">Description (Optional)</label>
        <textarea
          {...register('description')}
          className="form-control"
          rows={3}
          placeholder="Describe what this action does"
        />
      </div>

      <div>
        <label className="form-label">Action Type</label>
        <select
          {...register('actionType')}
          className="form-select"
        >
          {actionTypes.map(type => (
            <option key={type} value={type}>
              {getActionDisplayName(type)}
            </option>
          ))}
        </select>
      </div>

      {renderActionFields()}

      <div className="pt-4 border-t border-gray-200">
        <button type="submit" className="btn btn-primary w-full">
          Save Configuration
        </button>
      </div>
    </form>
  );
};