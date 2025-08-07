import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthResponse } from '../types/core/user.types';
import { authService } from '../services';
import { useUserStore } from '../store/userStore';
import { TOKEN_KEY } from '../security/authentication-provider';

// Log the imported TOKEN_KEY for debugging
console.log('[AUTH CONTEXT] Imported TOKEN_KEY:', TOKEN_KEY);

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<User>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setUserData, clearUserData } = useUserStore();

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AUTH DEBUG] Starting authentication check on page load/refresh');
      try {
        // First check if token is valid
        const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        console.log('[AUTH DEBUG] Token found:', token ? 'Yes' : 'No');
        
        const tokenValid = authService.isAuthenticated();
        console.log('[AUTH DEBUG] Token validation result:', tokenValid);
        
        setIsAuthenticated(tokenValid);
        
        // Only try to get user data if token is valid
        if (tokenValid) {
          console.log('[AUTH DEBUG] Token is valid, retrieving user data');
          const currentUser = authService.getCurrentUser();
          
          if (currentUser) {
            console.log('[AUTH DEBUG] User data found in storage:', currentUser.username);
            setUser(currentUser);
            // Save role and companyType to Zustand store
            setUserData(currentUser.role, currentUser.companyType || null);
          } else {
            console.log('[AUTH DEBUG] No user data in storage, fetching from API');
            // Token is valid but no user data in storage
            // Try to fetch user profile from API
            try {
              const userProfile = await authService.getUserProfile();
              console.log('[AUTH DEBUG] User profile fetched from API:', userProfile.username);
              setUser(userProfile);
              setUserData(userProfile.role, userProfile.companyType || null);
            } catch (profileError) {
              console.error('[AUTH DEBUG] Failed to fetch user profile:', profileError);
              // If we can't get the profile, authentication has failed
              setIsAuthenticated(false);
            }
          }
        } else {
          console.log('[AUTH DEBUG] Token is invalid or missing, clearing user data');
          // Clear user data if token is invalid
          setUser(null);
          clearUserData();
        }
      } catch (error) {
        console.error('[AUTH DEBUG] Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log('[AUTH DEBUG] Authentication check completed, loading state set to false');
      }
    };

    void checkAuth();
  }, [setUserData, clearUserData]);
  
  // Log authentication state changes
  useEffect(() => {
    console.log('[AUTH DEBUG] Authentication state changed:', { 
      isAuthenticated, 
      isLoading,
      hasUser: !!user,
      username: user?.username || 'none'
    });
  }, [isAuthenticated, isLoading, user]);

  // Login handler
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Save user role and companyType to Zustand store
      setUserData(response.user.role, response.user.companyType || null);
      
      console.log('Login successful, authentication state updated');
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear user data from Zustand store
      clearUserData();
      
      console.log('Logout successful, authentication state cleared');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if the API call fails
      setUser(null);
      setIsAuthenticated(false);
      clearUserData();
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      
      // Ensure we're still authenticated after profile update
      setIsAuthenticated(true);
      
      // Update Zustand store if role or companyType changed
      if (userData.role || userData.companyType) {
        setUserData(
          updatedUser.role, 
          updatedUser.companyType || null
        );
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      // Don't change authentication state on profile update failure
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};