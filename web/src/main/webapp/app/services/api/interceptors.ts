/**
 * API interceptors for authentication and error handling
 */

import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { axiosInstance, authAxiosInstance } from './client';
import { ServerErrorResponse } from '../../types/core/error.types';
import { TOKEN_KEY } from '../../security/authentication-provider';
import { authService } from '../../services';

// User storage key
const USER_KEY = 'octopus_tms_user';
const REFRESH_TOKEN_KEY = 'octopus_tms_refresh_token';

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

// Use authService to check if token is valid
const isTokenValid = (): boolean => {
  return authService.isAuthenticated();
};

// Get token from storage using consistent approach
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

// Clear auth data using consistent approach
const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Setup request interceptor to add auth token
 */
export const setupAuthInterceptor = () => {
  const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    // Skip auth for certain endpoints
    const skipAuthUrls = ['/authenticate', '/passwordReset', '/register', '/auth/login'];
    const shouldSkipAuth = skipAuthUrls.some(url => config.url?.includes(url));
    
    if (!shouldSkipAuth && !config.headers?.skipAuth) {
      // Only add token if it's valid
      if (isTokenValid() && config.headers) {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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
        // Skip refresh for auth endpoints
        const skipRefreshUrls = ['/authenticate', '/auth/login', '/passwordReset', '/register'];
        if (originalRequest.url && skipRefreshUrls.some(url => originalRequest.url?.includes(url))) {
          return Promise.reject(error);
        }
        
        if (isRefreshing) {
          // Queue this request while token is being refreshed
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
          // Attempt to refresh token using authService
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          // Call refresh endpoint
          const response = await axiosInstance.post('/auth/refresh', { refreshToken }, { skipAuth: true });
          const { accessToken } = response.data;
          
          // Store new token in the same storage location as the original token
          const isPersistent = localStorage.getItem(TOKEN_KEY) !== null;
          
          if (isPersistent) {
            // Update in localStorage and clear sessionStorage
            localStorage.setItem(TOKEN_KEY, accessToken);
            sessionStorage.removeItem(TOKEN_KEY);
          } else {
            // Update in sessionStorage and clear localStorage
            sessionStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.removeItem(TOKEN_KEY);
          }
          
          // Update auth header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          // Process queued requests
          processQueue(null, accessToken);
          return axiosInstance(originalRequest);
          
        } catch (refreshError) {
          // Handle refresh failure
          processQueue(refreshError as Error, null);
          clearAuth();
          
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?session=expired';
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
        console.error('API Error:', apiError);
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