/**
 * API interceptors for authentication and error handling
 */

import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { axiosInstance, authAxiosInstance } from './client';
import { ServerErrorResponse } from '../../types/core/error.types';

// Token storage keys
const TOKEN_KEY = 'octopus_tms_token';
const USER_KEY = 'octopus_tms_user';

// Auth state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Helper functions
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
};

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Setup request interceptor to add auth token
 */
export const setupAuthInterceptor = () => {
  const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    // Skip auth for certain endpoints
    const skipAuthUrls = ['/authenticate', '/passwordReset', '/register'];
    const shouldSkipAuth = skipAuthUrls.some(url => config.url?.includes(url));
    
    if (!shouldSkipAuth && !config.headers?.skipAuth) {
      const token = getToken();
      
      if (token && config.headers) {
        if (isTokenExpired(token)) {
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Remove custom header
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
    }
    
    return config;
  };
  
  const errorHandler = (error: unknown) => Promise.reject(error);
  
  // Apply to both instances
  axiosInstance.interceptors.request.use(requestInterceptor, errorHandler);
  authAxiosInstance.interceptors.request.use(requestInterceptor, errorHandler);
};

/**
 * Setup response interceptor for error handling and token refresh
 */
export const setupErrorInterceptor = () => {
  const successHandler = <T = any>(response: import('axios').AxiosResponse<T>) => response;
  const errorHandler = async (error: AxiosError<ServerErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes('/authenticate')) {
          // Don't retry auth endpoint
          return Promise.reject(error);
        }
        
        if (isRefreshing) {
          // Queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // Attempt to refresh token
          const response = await axiosInstance.post('/auth/refresh', {
            refreshToken: localStorage.getItem('octopus_tms_refresh_token')
          });
          
          const { accessToken } = response.data;
          
          // Store new token
          const rememberMe = localStorage.getItem(TOKEN_KEY) !== null;
          if (rememberMe) {
            localStorage.setItem(TOKEN_KEY, accessToken);
          } else {
            sessionStorage.setItem(TOKEN_KEY, accessToken);
          }
          
          // Update auth header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          processQueue(null, accessToken);
          return axiosInstance(originalRequest);
          
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          clearAuth();
          
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Transform error for consistent handling
      const apiError: ServerErrorResponse = {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        fieldErrors: error.response?.data?.fieldErrors,
        code: error.response?.data?.code,
        timestamp: error.response?.data?.timestamp || new Date().toISOString(),
        path: originalRequest?.url
      };
      
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
      }
      
      return Promise.reject(apiError);
    };
  
  // Apply to both instances
  axiosInstance.interceptors.response.use(successHandler, errorHandler);
  authAxiosInstance.interceptors.response.use(successHandler, errorHandler);
};

/**
 * Initialize all interceptors
 */
export const initializeInterceptors = () => {
  setupAuthInterceptor();
  setupErrorInterceptor();
};