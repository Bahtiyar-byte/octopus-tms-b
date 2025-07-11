import * as yup from 'yup';
import { UseFormSetError } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';

export function setYupDefaults() {
  yup.setLocale({
    mixed: {
      required: 'validation.required',
    },
    string: {
      email: 'validation.email',
      max: ({ max }) => ({ key: 'validation.max', values: { max } }),
    },
  });
}

export function handleServerError(
  error: any,
  navigate: NavigateFunction,
  setError?: UseFormSetError<any>,
  t?: (key: string) => string,
  getMessage?: (key: string) => string
) {
  if (error.response?.status === 422 && error.response?.data?.fieldErrors && setError) {
    Object.keys(error.response.data.fieldErrors).forEach((field) => {
      setError(field, {
        type: 'manual',
        message: error.response.data.fieldErrors[field],
      });
    });
  } else if (error.response?.status === 400) {
    console.error('Bad request:', error.response.data);
  } else {
    console.error('Server error:', error);
  }
}

// Add string extension for emptyToNull
declare global {
  interface String {
    emptyToNull(): string | null;
  }
}

String.prototype.emptyToNull = function() {
  return this.trim() === '' ? null : this.toString();
};

// Add yup extension
declare module 'yup' {
  interface StringSchema {
    emptyToNull(): StringSchema;
  }
}

yup.addMethod(yup.string, 'emptyToNull', function() {
  return this.transform((value) => {
    return value && value.trim() === '' ? null : value;
  });
});