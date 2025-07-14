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
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [, setLoginSuccessUrl] = useState('/');
  const navigate = useNavigate();
  const matches = useMatches();
  const roles = matches.reduce((accumulator: string[], currentMatch) => {
    return accumulator.concat((currentMatch.handle as RolesHandle)?.roles || []);
  }, []);

  const getToken = () => {
    // synchronize with potential other tabs
    if (localStorage.getItem('access_token') !== token) {
      setToken(localStorage.getItem('access_token'));
    }
    return token;
  };

  const isLoggedIn = () => {
    // check token available
    if (getToken() === null) {
      return false;
    }
    // check token not expired
    return getCurrentSeconds() < getTokenData().exp;
  };

  const login = (authenticationResponse: AuthenticationResponse) => {
    // Handle the response format from backend
    const token = authenticationResponse.token || authenticationResponse.accessToken;
    localStorage.setItem('access_token', token!);
    // Also store with the key expected by the frontend routes
    localStorage.setItem('octopus_tms_token', token!);
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
    localStorage.removeItem('access_token');
    setToken(null);
    navigate('/login', {
          state: {
            msgInfo: t('authentication.logout.success')
          }
        });
  };

  const hasAnyRole = () => {
    const tokenData = getTokenData();
    return roles.some((requiredRole) => tokenData.roles.includes(requiredRole));
  };

  const getTokenData = () => {
    return JSON.parse(atob(getToken()!.split('.')[1]!));
  };

  const getCurrentSeconds = () => {
    return Math.floor((new Date()).getTime() / 1000);
  };

  useEffect(() => {
    // include token in outgoing requests
    const interceptor = axios.interceptors.request.use(
        (config) => {
          if (localStorage.getItem('access_token')) {
            config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
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
    const accessError = checkAccessAllowed();
    if (!isLoggedIn() && ['/login', '/error'].indexOf(location.pathname) === -1) {
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
  }, [matches]);

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
