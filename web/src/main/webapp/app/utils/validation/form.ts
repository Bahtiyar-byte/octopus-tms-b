/**
 * Form validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, (value: unknown) => string | null>
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  for (const [field, validator] of Object.entries(rules) as [keyof T, (value: unknown) => string | null][]) {
    const error = validator(data[field]);
    if (error) {
      errors[field as string] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};