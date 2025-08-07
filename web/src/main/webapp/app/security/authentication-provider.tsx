import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatches, useNavigate } from 'react-router';
import { AuthenticationResponse } from './authentication-model';
import axios from 'axios';


export const ADMIN = 'ADMIN';
export const SUPERVISOR = 'SUPERVISOR';
export const DISPATCHER = 'DISPATCHER';
export const DRIVER = 'DRIVER';
export const ACCOUNTING = 'ACCOUNTING';
export const SALES = 'SALES';
export const SUPPORT = 'SUPPORT';
export const BROKER = 'BROKER';
export const CARRIER = 'CARRIER';
export const SHIPPER = 'SHIPPER';

// Consistent token key used across the application
export const TOKEN_KEY = 'octopus_tms_token';

export const AuthenticationContext = createContext<{
  isLoggedIn: () => boolean;
  getToken: () => string|null;
  login: (authenticationResponse: AuthenticationResponse) => string;
  logout: () => void;
}>({
  isLoggedIn: () => false,
  getToken: () => null,
  login: () => '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {}
});

/**
 * Central management of authentication. Checks the availability of a required role before loading a route.
 * Adds the current token to outgoing HTTP requests.
 */
export const AuthenticationProvider = ({ children }: AuthenticationProviderParams) => {
  const { t } = useTranslation();
  const [initCompleted, setInitCompleted] = useState(false);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY));
  const [, setLoginSuccessUrl] = useState('/');
  const navigate = useNavigate();
  const matches = useMatches();
  const roles = matches.reduce((accumulator: string[], currentMatch) => {
    return accumulator.concat((currentMatch.handle as RolesHandle)?.roles || []);
  }, []);

  const getToken = () => {
    // Check both localStorage and sessionStorage for the token
    const localToken = localStorage.getItem(TOKEN_KEY);
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    const currentToken = localToken || sessionToken;
    
    // Update state if token has changed
    if (currentToken !== token) {
      setToken(currentToken);
    }
    
    return currentToken;
  };

  const isLoggedIn = () => {
    // check token available
    const currentToken = getToken();
    if (currentToken === null) {
      return false;
    }
    
    try {
      // check token not expired
      return getCurrentSeconds() < getTokenData(currentToken).exp;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const login = (authenticationResponse: AuthenticationResponse) => {
    // Handle the response format from backend
    const token = authenticationResponse.token || authenticationResponse.accessToken;
    
    // Store token consistently in localStorage
    localStorage.setItem(TOKEN_KEY, token!);
    
    // Update state
    setToken(token!);
    
    // Get user role from response or token
    let userRole = null;
    if (authenticationResponse.user && authenticationResponse.user.role) {
      userRole = authenticationResponse.user.role;
    } else {
      // Fallback to parsing token
      const tokenData = JSON.parse(atob(token!.split('.')[1]!));
      const userRoles = tokenData.roles || [];
      userRole = userRoles[0];
    }
    
    // Redirect based on primary role
    let navigateTo = '/';
    if (userRole === 'BROKER') {
      navigateTo = '/broker/dashboard';
    } else if (userRole === 'CARRIER') {
      navigateTo = '/carrier/dashboard';
    } else if (userRole === 'SHIPPER') {
      navigateTo = '/shipper/dashboard';
    } else if (userRole === 'ADMIN' || userRole === 'SUPERVISOR') {
      navigateTo = '/broker/dashboard'; // Default admin/supervisor to broker dashboard
    } else {
      navigateTo = '/'; // Default fallback
    }
    
    setLoginSuccessUrl('/');
    return navigateTo;
  };

  const logout = () => {
    if (isLoggedIn()) {
      setLoginSuccessUrl('/');
    }
    // Remove token from both storage locations
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate('/login', {
          state: {
            msgInfo: t('authentication.logout.success')
          }
        });
  };

  const hasAnyRole = () => {
    const currentToken = getToken();
    if (!currentToken) return false;
    
    try {
      const tokenData = getTokenData(currentToken);
      return roles.some((requiredRole) => tokenData.roles.includes(requiredRole));
    } catch (error) {
      console.error('Error checking roles:', error);
      return false;
    }
  };

  const getTokenData = (tokenValue = getToken()) => {
    if (!tokenValue) throw new Error('No token available');
    return JSON.parse(atob(tokenValue.split('.')[1]!));
  };

  const getCurrentSeconds = () => {
    return Math.floor((new Date()).getTime() / 1000);
  };

  useEffect(() => {
    // Check for token on initial load
    const initialToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (initialToken) {
      setToken(initialToken);
    }
    
    // Include token in outgoing requests
    const interceptor = axios.interceptors.request.use(
        (config) => {
          const currentToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
          if (currentToken) {
            config.headers['Authorization'] = 'Bearer ' + currentToken;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        });
    setInitCompleted(true);

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const checkAccessAllowed = () => {
    if (roles.length > 0 && !isLoggedIn()) {
      return 'login-required';
    } else if (roles.length > 0 && !hasAnyRole()) {
      return 'missing-role';
    }
    return null;
  };

  useEffect(() => {
    // Only run this effect after initialization is complete
    if (!initCompleted) return;
    
    const accessError = checkAccessAllowed();
    if (!isLoggedIn() && ['/login', '/error', '/forgot-password'].indexOf(location.pathname) === -1) {
      setLoginSuccessUrl(location.pathname);
    }
    if (accessError === 'login-required') {
      setLoginSuccessUrl(location.pathname);
      navigate('/login', {
            state: {
              msgInfo: t('authentication.login.required')
            }
          });
    } else if (accessError === 'missing-role') {
      navigate('/error', {
            state: {
              errorStatus: '403',
              msgError: t('authentication.role.missing')
            }
          });
    }
  }, [matches, initCompleted]);

  if (checkAccessAllowed() !== null) {
    // don't render current route
    return;
  }
  return <AuthenticationContext.Provider value={{ isLoggedIn, getToken, login, logout }}>{initCompleted && children}</AuthenticationContext.Provider>;
};

interface AuthenticationProviderParams {
  children: ReactNode;
}

interface RolesHandle {
  roles?: string[];
}
