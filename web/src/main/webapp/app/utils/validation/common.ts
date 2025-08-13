/**
 * Common validation utilities
 */

export const isRequired = (value: string | number | undefined | null): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
};

export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (!isRequired(value as string | number | undefined | null)) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (!hasMinLength(value, minLength)) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (!hasMaxLength(value, maxLength)) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
};