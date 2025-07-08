import React from 'react';
import { Node } from '@xyflow/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { ConditionNodeData, ComparisonOperator } from '../../types/workflow.types';
import { useWorkflowStore } from '../../store/workflowStore';
import { conditionNodeSchema } from '../../utils/validation';
import { toast } from 'react-hot-toast';

interface ConditionConfigPanelProps {
  node: Node<ConditionNodeData>;
}

type FormData = z.infer<typeof conditionNodeSchema>;

const fieldOptions = [
  { value: 'load.status', label: 'Load Status' },
  { value: 'load.rate', label: 'Load Rate' },
  { value: 'load.miles', label: 'Load Miles' },
  { value: 'carrier.rating', label: 'Carrier Rating' },
  { value: 'carrier.insuranceExpiry', label: 'Carrier Insurance Expiry' },
  { value: 'driver.hoursOfService', label: 'Driver Hours of Service' },
  { value: 'shipment.weight', label: 'Shipment Weight' },
  { value: 'shipment.value', label: 'Shipment Value' },
  { value: 'payment.status', label: 'Payment Status' },
  { value: 'payment.daysOverdue', label: 'Payment Days Overdue' },
];

const operatorOptions: { value: ComparisonOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'greater_than_or_equals', label: 'Greater Than or Equals' },
  { value: 'less_than_or_equals', label: 'Less Than or Equals' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'is_not_empty', label: 'Is Not Empty' },
];

export const ConditionConfigPanel: React.FC<ConditionConfigPanelProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(conditionNodeSchema),
    defaultValues: {
      label: node.data.label,
      description: node.data.description || '',
      moduleType: node.data.moduleType,
      isConfigured: node.data.isConfigured,
      conditions: node.data.conditions.length > 0 ? node.data.conditions : [
        { field: '', operator: 'equals', value: '' }
      ],
      logicalOperator: node.data.logicalOperator
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions'
  });

  const conditions = watch('conditions');

  const onSubmit = (data: FormData) => {
    updateNode(node.id, {
      ...data,
      isConfigured: true
    });

    toast.success('Condition configuration saved!');
  };

  const getValueInput = (index: number, operator: ComparisonOperator) => {
    if (operator === 'is_empty' || operator === 'is_not_empty') {
      return null;
    }

    const field = conditions[index]?.field;
    
    if (field?.includes('status')) {
      return (
        <select
          {...register(`conditions.${index}.value`)}
          className="form-select"
        >
          <option value="">Select...</option>
          <option value="booked">Booked</option>
          <option value="assigned">Assigned</option>
          <option value="picked_up">Picked Up</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      );
    }

    if (field?.includes('rate') || field?.includes('miles') || field?.includes('weight')) {
      return (
        <input
          type="number"
          {...register(`conditions.${index}.value`)}
          className="form-control"
          placeholder="Enter value"
        />
      );
    }

    return (
      <input
        type="text"
        {...register(`conditions.${index}.value`)}
        className="form-control"
        placeholder="Enter value"
      />
    );
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
          placeholder="Describe what this condition checks"
        />
      </div>

      <div>
        <label className="form-label">Conditions</label>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-3">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    {...register(`conditions.${index}.field`)}
                    className="form-select"
                  >
                    <option value="">Select field...</option>
                    {fieldOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    {...register(`conditions.${index}.operator`)}
                    className="form-select"
                  >
                    {operatorOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {getValueInput(index, conditions[index]?.operator)}
              </div>
              
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => append({ field: '', operator: 'equals', value: '' })}
          className="mt-3 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
        >
          <Plus size={14} />
          Add Condition
        </button>
      </div>

      {fields.length > 1 && (
        <div>
          <label className="form-label">Logical Operator</label>
          <select
            {...register('logicalOperator')}
            className="form-select"
          >
            <option value="AND">All conditions must be true (AND)</option>
            <option value="OR">Any condition must be true (OR)</option>
          </select>
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