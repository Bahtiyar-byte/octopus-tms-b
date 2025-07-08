/**
 * Input validation and sanitization utilities
 */

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex (US format)
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.trim());
};

/**
 * Validate required field
 */
export const isRequired = (value: string | number | undefined | null): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
};

/**
 * Validate minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Validate maximum length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Validate number is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Sanitize user input for display
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 1000); // Limit to 1000 chars
};

/**
 * Validate load ID format
 */
export const isValidLoadId = (loadId: string): boolean => {
  const loadIdRegex = /^(LD|LOAD|L)[0-9]{3,6}$/i;
  return loadIdRegex.test(loadId.trim());
};

/**
 * Validate invoice number format
 */
export const isValidInvoiceNumber = (invoiceNumber: string): boolean => {
  const invoiceRegex = /^INV-[0-9]{4,6}$/i;
  return invoiceRegex.test(invoiceNumber.trim());
};

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate form data
 */
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, (value: any) => string | null>
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  for (const [field, validator] of Object.entries(rules) as [keyof T, (value: any) => string | null][]) {
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