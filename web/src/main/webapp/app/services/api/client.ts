/**
 * Centralized API client with TypeScript generics for type-safe requests
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError, ApiResponse } from '../../types/core/error.types';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for auth endpoints without /api prefix
const authAxiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request types
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

// Helper to determine which axios instance to use
const getAxiosInstance = (url: string): AxiosInstance => {
  // Use auth instance for endpoints that don't need /api prefix
  const authEndpoints = ['/authenticate', '/passwordReset', '/register', '/auth'];
  if (authEndpoints.some(endpoint => url.startsWith(endpoint))) {
    return authAxiosInstance;
  }
  return axiosInstance;
};

// Generic API client class
export class ApiClient {
  /**
   * GET request with type-safe response
   */
  static async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const instance = getAxiosInstance(url);
    const response = await instance.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request with type-safe response
   */
  static async post<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    const instance = getAxiosInstance(url);
    const response = await instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request with type-safe response
   */
  static async put<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    const instance = getAxiosInstance(url);
    const response = await instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request with type-safe response
   */
  static async patch<T, D = any>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    const instance = getAxiosInstance(url);
    const response = await instance.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request with type-safe response
   */
  static async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const instance = getAxiosInstance(url);
    const response = await instance.delete<T>(url, config);
    return response.data;
  }

  /**
   * Upload file with progress tracking
   */
  static async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  /**
   * Download file
   */
  static async download(url: string, filename: string, config?: RequestConfig): Promise<void> {
    const response = await axiosInstance.get(url, {
      ...config,
      responseType: 'blob',
    });

    // Create download link
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Get axios instance for advanced usage
   */
  static getAxiosInstance(): AxiosInstance {
    return axiosInstance;
  }
}

// Export axios instances for interceptor setup
export { axiosInstance, authAxiosInstance };

// Helper function to create API endpoints
export function createApiEndpoint<TRequest = any, TResponse = any>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string
) {
  return async (data?: TRequest, config?: RequestConfig): Promise<TResponse> => {
    switch (method) {
      case 'get':
        return ApiClient.get<TResponse>(url, config);
      case 'post':
        return ApiClient.post<TResponse, TRequest>(url, data, config);
      case 'put':
        return ApiClient.put<TResponse, TRequest>(url, data, config);
      case 'patch':
        return ApiClient.patch<TResponse, TRequest>(url, data, config);
      case 'delete':
        return ApiClient.delete<TResponse>(url, config);
    }
  };
}