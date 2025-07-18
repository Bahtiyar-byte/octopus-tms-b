import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  error,
  helperText,
  required,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  helperClassName,
  className,
  id,
  ...props
}, ref) => {
  // Generate a unique ID if not provided
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={clsx('mb-4', containerClassName)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={clsx(
            'block text-sm font-medium text-gray-700 mb-1',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={fieldId}
        className={clsx(
          'block w-full rounded-md shadow-sm transition-colors duration-200',
          'px-3 py-2 border focus:outline-none focus:ring-2',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
          inputClassName,
          className
        )}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
        }
        {...props}
      />
      
      {error && (
        <p
          id={`${fieldId}-error`}
          className={clsx(
            'mt-2 text-sm text-red-600',
            errorClassName
          )}
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p
          id={`${fieldId}-helper`}
          className={clsx(
            'mt-2 text-sm text-gray-500',
            helperClassName
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;