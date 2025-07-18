import { 
  LoginCredentials, 
  AuthResponse, 
  User, 
  ResetPasswordRequest, 
  ChangePasswordRequest,
  UserRole 
} from '../types/user';
import axios from 'axios';

// API base URL
const API_BASE_URL = '';


// Local storage keys
const TOKEN_KEY = 'octopus_tms_token';
const USER_KEY = 'octopus_tms_user';

export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Call the real backend API
      const response = await axios.post('/authenticate', {
        username: credentials.username,
        password: credentials.password
      });

      const { accessToken } = response.data;
      
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
        expiresAt: payload.exp * 1000 // Convert to milliseconds
      };

      // Store in localStorage if remember me is true
      if (credentials.rememberMe) {
        localStorage.setItem(TOKEN_KEY, authResponse.token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        // Use session storage if not remembering
        sessionStorage.setItem(TOKEN_KEY, authResponse.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authResponse.token}`;

      return authResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Invalid username or password');
      }
      throw new Error('Invalid username or password');
    }
  },

  // Logout function
  logout: async (): Promise<void> => {
    // In a real app, this might invalidate the token on the server
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  },

  // Check if a user is currently authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  // Get the current user if authenticated
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      
      // If token exists, ensure axios header is set
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  },

  // Refresh token (for extending sessions)
  refreshToken: async (): Promise<string> => {
    const user = authService.getCurrentUser();
    const currentToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    
    if (!user || !currentToken) {
      return Promise.reject(new Error('No authenticated user'));
    }

    try {
      // Call backend refresh endpoint
      const response = await axios.post('/api/auth/refresh', {
        token: currentToken
      });
      
      const newToken = response.data.accessToken;
      const storageType = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      
      storageType.setItem(TOKEN_KEY, newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return newToken;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  },

  // Request password reset
  requestPasswordReset: async (request: ResetPasswordRequest): Promise<void> => {
    try {
      // Call backend password reset endpoint
      await axios.post('/api/auth/reset-password', {
        email: request.email
      });
      
      console.log(`Password reset requested for ${request.email}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to request password reset');
      }
      throw new Error('Failed to request password reset');
    }
  },

  // Change password
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    try {
      // Call backend change password endpoint
      await axios.post('/api/auth/change-password', {
        oldPassword: request.oldPassword,
        newPassword: request.newPassword
      });
      
      console.log('Password changed successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
      }
      throw new Error('Failed to change password');
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      // Call backend update profile endpoint
      const response = await axios.put('/api/profile', userData);
      const updatedUser = response.data;
      
      // Update in storage
      const storageType = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
      storageType.setItem(USER_KEY, JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
      }
      throw new Error('Failed to update profile');
    }
  },

  // Get current user profile from backend
  getProfile: async (): Promise<User> => {
    try {
      const response = await axios.get('/api/profile');
      const user = response.data;
      
      // Update in storage
      const storageType = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
      storageType.setItem(USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to get profile');
      }
      throw new Error('Failed to get profile');
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to upload avatar');
      }
      throw new Error('Failed to upload avatar');
    }
  },

  // Get user statistics
  getUserStats: async (): Promise<any> => {
    try {
      const response = await axios.get('/api/profile/stats');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to get user stats');
      }
      throw new Error('Failed to get user stats');
    }
  }
};
