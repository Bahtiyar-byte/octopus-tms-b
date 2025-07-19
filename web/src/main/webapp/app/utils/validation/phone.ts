/**
 * Phone number validation utilities
 */

// US phone format
const PHONE_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.trim());
};

export const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  if (!isValidPhone(phone)) {
    return 'Invalid phone number format';
  }
  return null;
};