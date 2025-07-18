import * as yup from 'yup';
import { UseFormSetError, FieldValues } from 'react-hook-form';
import { NavigateFunction } from 'react-router-dom';
import { ApiAxiosError } from '../types/core/error.types';

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

export function handleServerError<TFieldValues extends FieldValues = FieldValues>(
  error: unknown,
  navigate: NavigateFunction,
  setError?: UseFormSetError<TFieldValues>,
  t?: (key: string) => string,
  getMessage?: (key: string) => string
) {
  const axiosError = error as ApiAxiosError;
  if (axiosError.response?.status === 422 && axiosError.response?.data?.fieldErrors && setError) {
    Object.entries(axiosError.response.data.fieldErrors).forEach(([field, message]) => {
      setError(field as any, {
        type: 'manual',
        message: message,
      });
    });
  } else if (axiosError.response?.status === 400) {
    console.error('Bad request:', axiosError.response.data);
  } else {
    console.error('Server error:', axiosError);
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