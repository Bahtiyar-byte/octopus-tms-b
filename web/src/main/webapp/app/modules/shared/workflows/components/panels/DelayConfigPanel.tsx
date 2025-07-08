import React from 'react';
import { Node } from '@xyflow/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DelayNodeData } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { delayNodeSchema } from '../../utils/validation';
import { toast } from 'react-hot-toast';

interface DelayConfigPanelProps {
  node: Node<DelayNodeData>;
}

type FormData = z.infer<typeof delayNodeSchema>;

export const DelayConfigPanel: React.FC<DelayConfigPanelProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(delayNodeSchema),
    defaultValues: {
      label: node.data.label,
      description: node.data.description || '',
      moduleType: node.data.moduleType,
      isConfigured: node.data.isConfigured,
      delayType: node.data.delayType,
      delayAmount: node.data.delayAmount,
      delayUnit: node.data.delayUnit,
      untilDate: node.data.untilDate,
      businessHoursOnly: node.data.businessHoursOnly
    }
  });

  const delayType = watch('delayType');

  const onSubmit = (data: FormData) => {
    updateNode(node.id, {
      ...data,
      isConfigured: true
    });

    toast.success('Delay configuration saved!');
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
          placeholder="Describe what this delay is for"
        />
      </div>

      <div>
        <label className="form-label">Delay Type</label>
        <select
          {...register('delayType')}
          className="form-select"
        >
          <option value="fixed">Fixed Duration</option>
          <option value="until_date">Until Specific Date/Time</option>
          <option value="business_hours">Business Hours Only</option>
        </select>
      </div>

      {delayType === 'fixed' && (
        <>
          <div>
            <label className="form-label">Duration</label>
            <div className="flex gap-2">
              <input
                type="number"
                {...register('delayAmount', { valueAsNumber: true })}
                className="form-control flex-1"
                min="1"
                placeholder="Amount"
              />
              <select
                {...register('delayUnit')}
                className="form-select flex-1"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </>
      )}

      {delayType === 'until_date' && (
        <div>
          <label className="form-label">Wait Until</label>
          <input
            type="datetime-local"
            {...register('untilDate')}
            className="form-control"
          />
          <p className="text-sm text-gray-500 mt-1">
            Workflow will pause until this date/time
          </p>
        </div>
      )}

      {delayType === 'business_hours' && (
        <div>
          <label className="form-label">Business Hours Configuration</label>
          <div className="space-y-3">
            <div>
              <label className="form-label text-sm">Wait Duration</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  {...register('delayAmount', { valueAsNumber: true })}
                  className="form-control flex-1"
                  min="1"
                  placeholder="Amount"
                />
                <select
                  {...register('delayUnit')}
                  className="form-select flex-1"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Time will only count during business hours (9 AM - 5 PM, Mon-Fri)
            </p>
          </div>
        </div>
      )}

      {(delayType === 'fixed' || delayType === 'business_hours') && (
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('businessHoursOnly')}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Count business hours only</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            When checked, weekends and non-business hours won't count
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