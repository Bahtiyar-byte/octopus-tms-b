/**
 * Centralized API module
 */

export { ApiClient, createApiEndpoint, axiosInstance } from './client';
export { initializeInterceptors } from './interceptors';
export type { RequestConfig } from './client';