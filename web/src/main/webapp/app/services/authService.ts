import { 
  LoginCredentials, 
  AuthResponse, 
  User, 
  ResetPasswordRequest, 
  ChangePasswordRequest,
  UserRole 
} from '../types/core/user.types';
import { ApiClient } from './api';
import { TOKEN_KEY } from '../security/authentication-provider';

// Local storage keys
const USER_KEY = 'octopus_tms_user';
const REFRESH_TOKEN_KEY = 'octopus_tms_refresh_token';

// Response types
interface LoginResponse {
  token: string;
  refreshToken?: string;
  tokenExpiry?: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyType: string;
    company?: string;
    companyName?: string;
  };
  permissions?: string[];
}

interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Call the real backend API
      const response = await ApiClient.post<LoginResponse>('/auth/login', {
        username: credentials.username,
        password: credentials.password
      }, { skipAuth: true });

      const { token, refreshToken, user: userDto } = response;
      
      // Create user object from response
      const user: User = {
        id: userDto.id,
        username: userDto.username,
        email: userDto.email,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        role: userDto.role,
        companyId: userDto.company,
        companyName: userDto.companyName,
        companyType: userDto.companyType as any, // Cast to enum
        lastLogin: new Date().toISOString()
      };

      // Decode JWT to get expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const authResponse: AuthResponse = {
        user,
        token: token,
        expiresAt: payload.exp ? payload.exp * 1000 : Date.now() + 86400000 // Default 24 hours
      };

      // Store token and user data based on remember me
      if (credentials.rememberMe) {
        // For persistent login, store in localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        // Clear any session storage to avoid conflicts
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      } else {
        // For session-only login, store in sessionStorage
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        if (refreshToken) {
          sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        // Clear any local storage to avoid conflicts
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
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
      // Clear all storage locations to ensure complete logout
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
    // Check both storage locations for user data
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    console.log('[AUTH SERVICE] Checking if user is authenticated');
    
    // Check both storage locations for token
    const localToken = localStorage.getItem(TOKEN_KEY);
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    const token = localToken || sessionToken;
    
    console.log('[AUTH SERVICE] Token found in:', {
      localStorage: !!localToken,
      sessionStorage: !!sessionToken
    });
    
    if (token) {
      try {
        // Decode token and check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeLeft = expTime - currentTime;
        const isValid = timeLeft > 0;
        
        console.log('[AUTH SERVICE] Token validation:', {
          isValid,
          expiresAt: new Date(expTime).toISOString(),
          currentTime: new Date(currentTime).toISOString(),
          timeLeftMs: timeLeft,
          timeLeftMin: Math.round(timeLeft / 60000)
        });
        
        // If token is expired, clean up storage
        if (!isValid) {
          console.log('[AUTH SERVICE] Token expired, cleaning up storage');
          localStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(TOKEN_KEY);
        }
        
        return isValid;
      } catch (error) {
        console.error('[AUTH SERVICE] Error validating token:', error);
        // Clean up invalid token
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        return false;
      }
    }
    
    console.log('[AUTH SERVICE] No token found, user is not authenticated');
    return false;
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    // Check both storage locations for refresh token
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await ApiClient.post<RefreshResponse>('/auth/refresh', {
        refreshToken
      }, { skipAuth: true });

      const { accessToken } = response;

      // Update stored token in the same storage location as the original token
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