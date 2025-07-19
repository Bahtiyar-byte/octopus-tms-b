import React from 'react';
import { Node } from '@xyflow/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TriggerNodeData, TriggerType } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { getTriggersForModule, getTriggerDisplayName } from '../../utils/nodeHelpers';
import { triggerNodeSchema } from '../../utils/validation';
import { toast } from 'react-hot-toast';

interface TriggerConfigPanelProps {
  node: Node<TriggerNodeData>;
}

const formSchema = triggerNodeSchema.extend({
  loadStatusFilter: z.string().optional(),
  carrierRatingThreshold: z.number().optional(),
  paymentAmountThreshold: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

type TriggerConfig = {
  statusFilter?: string;
  ratingThreshold?: number;
  amountThreshold?: number;
};

export const TriggerConfigPanel: React.FC<TriggerConfigPanelProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore();
  const availableTriggers = getTriggersForModule(node.data.moduleType);

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
      triggerType: node.data.triggerType,
      moduleType: node.data.moduleType,
      isConfigured: node.data.isConfigured,
      ...node.data.triggerConfig
    }
  });

  const selectedTriggerType = watch('triggerType');

  const onSubmit = (data: FormData) => {
    const { loadStatusFilter, carrierRatingThreshold, paymentAmountThreshold, ...nodeData } = data;
    
    const triggerConfig: TriggerConfig = {};
    
    // Add specific config based on trigger type
    if (selectedTriggerType === 'load_status_changed' && loadStatusFilter) {
      triggerConfig.statusFilter = loadStatusFilter;
    }
    if (selectedTriggerType === 'carrier_assigned' && carrierRatingThreshold) {
      triggerConfig.ratingThreshold = carrierRatingThreshold;
    }
    if (selectedTriggerType === 'payment_received' && paymentAmountThreshold) {
      triggerConfig.amountThreshold = paymentAmountThreshold;
    }

    updateNode(node.id, {
      ...nodeData,
      triggerConfig: Object.keys(triggerConfig).length > 0 ? triggerConfig : undefined,
      isConfigured: true
    });

    toast.success('Trigger configuration saved!');
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
          placeholder="Describe what this trigger does"
        />
      </div>

      <div>
        <label className="form-label">Trigger Type</label>
        <select
          {...register('triggerType')}
          className="form-select"
        >
          {availableTriggers.map(trigger => (
            <option key={trigger} value={trigger}>
              {getTriggerDisplayName(trigger)}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic fields based on trigger type */}
      {selectedTriggerType === 'load_status_changed' && (
        <div>
          <label className="form-label">Status Filter (Optional)</label>
          <select
            {...register('loadStatusFilter')}
            className="form-select"
          >
            <option value="">Any Status</option>
            <option value="booked">Booked</option>
            <option value="assigned">Assigned</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Trigger only when load changes to this status
          </p>
        </div>
      )}

      {selectedTriggerType === 'carrier_assigned' && (
        <div>
          <label className="form-label">Minimum Carrier Rating (Optional)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...register('carrierRatingThreshold', { valueAsNumber: true })}
            className="form-control"
            placeholder="e.g., 4.5"
          />
          <p className="text-sm text-gray-500 mt-1">
            Trigger only for carriers with rating above this threshold
          </p>
        </div>
      )}

      {selectedTriggerType === 'payment_received' && (
        <div>
          <label className="form-label">Minimum Payment Amount (Optional)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('paymentAmountThreshold', { valueAsNumber: true })}
            className="form-control"
            placeholder="e.g., 1000.00"
          />
          <p className="text-sm text-gray-500 mt-1">
            Trigger only for payments above this amount
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <button type="submit" className="btn btn-primary w-full">
          Save Configuration
        </button>
      </div>
    </form>
  );
};