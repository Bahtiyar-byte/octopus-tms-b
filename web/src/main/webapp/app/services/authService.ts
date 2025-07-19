import { 
  LoginCredentials, 
  AuthResponse, 
  User, 
  ResetPasswordRequest, 
  ChangePasswordRequest,
  UserRole 
} from '../types/core/user.types';
import { ApiClient } from './api';

// Local storage keys
const TOKEN_KEY = 'octopus_tms_token';
const USER_KEY = 'octopus_tms_user';
const REFRESH_TOKEN_KEY = 'octopus_tms_refresh_token';

// Response types
interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Call the real backend API
      const response = await ApiClient.post<LoginResponse>('/authenticate', {
        username: credentials.username,
        password: credentials.password
      }, { skipAuth: true });

      const { accessToken, refreshToken } = response;
      
      // Decode JWT to get user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      
      // Create user object from JWT payload
      const user: User = {
        id: payload.sub || payload.userId || credentials.username,
        username: credentials.username,
        email: payload.email || credentials.username,
        firstName: payload.firstName || payload.given_name || credentials.username.split('@')[0].split('.')[0] || credentials.username,
        lastName: payload.lastName || payload.family_name || credentials.username.split('@')[0].split('.')[1] || '',
        role: (payload.roles?.[0] || payload.role || 'BROKER') as UserRole,
        avatarUrl: payload.avatarUrl || payload.picture || '',
        phone: payload.phone || payload.phoneNumber || '',
        department: payload.department || payload.dept || '',
        lastLogin: payload.lastLogin || new Date().toISOString()
      };

      const authResponse: AuthResponse = {
        user,
        token: accessToken,
        expiresAt: Date.now() + (payload.exp ? payload.exp * 1000 : 3600000) // Default 1 hour
      };

      // Store token and user data based on remember me
      if (credentials.rememberMe) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
      } else {
        sessionStorage.setItem(TOKEN_KEY, accessToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        if (refreshToken) {
          sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
      }

      return authResponse;
    } catch (error: unknown) {
      if (error instanceof Error && 'status' in error && error.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  },

  // Logout function
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if available
      await ApiClient.post('/auth/logout', {});
    } catch (error) {
      // Ignore logout errors
      console.warn('Logout endpoint error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
      } catch {
        return false;
      }
    }
    return false;
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await ApiClient.post<RefreshResponse>('/auth/refresh', {
        refreshToken
      }, { skipAuth: true });

      const { accessToken } = response;

      // Update stored token
      const rememberMe = localStorage.getItem(TOKEN_KEY) !== null;
      if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, accessToken);
      } else {
        sessionStorage.setItem(TOKEN_KEY, accessToken);
      }

      return accessToken;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  },

  // Reset password request
  resetPassword: async (request: ResetPasswordRequest): Promise<void> => {
    await ApiClient.post('/passwordReset/reset', request, { skipAuth: true });
  },

  // Change password
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await ApiClient.post('/auth/change-password', request);
  },

  // Get user profile
  getUserProfile: async (): Promise<User> => {
    return await ApiClient.get<User>('/profile');
  },

  // Update user profile
  updateUserProfile: async (updates: Partial<User>): Promise<User> => {
    return await ApiClient.put<User>('/profile', updates);
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<string> => {
    return await ApiClient.upload<string>('/profile/avatar', file);
  },

  // Get user statistics
  getUserStats: async (): Promise<Record<string, unknown>> => {
    return await ApiClient.get<Record<string, unknown>>('/profile/stats');
  },

  // Legacy method aliases for backward compatibility
  requestPasswordReset: async (request: ResetPasswordRequest): Promise<void> => {
    return authService.resetPassword(request);
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return authService.updateUserProfile(userData);
  },

  getProfile: async (): Promise<User> => {
    return authService.getUserProfile();
  }
};