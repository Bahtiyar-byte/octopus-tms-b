import React from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface InputRowProps<TFieldValues extends FieldValues = FieldValues> {
  useFormResult: UseFormReturn<TFieldValues>;
  object: string;
  field: Path<TFieldValues>;
  required?: boolean;
  type?: string;
}

export default function InputRow<TFieldValues extends FieldValues = FieldValues>({ 
  useFormResult, 
  object, 
  field, 
  required = false, 
  type = 'text' 
}: InputRowProps<TFieldValues>) {
  const { t } = useTranslation();
  const { register, formState: { errors } } = useFormResult;
  const error = errors[field];

  return (
    <div className="mb-4">
      <label htmlFor={field} className="block text-sm font-medium text-gray-700">
        {t(`${object}.${field}`)}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={field}
        type={type}
        {...register(field)}
        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
          ${error ? 'border-red-300' : 'border-gray-300'} 
          px-3 py-2 border`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {typeof error.message === 'string' ? error.message : t('validation.required')}
        </p>
      )}
    </div>
  );
}