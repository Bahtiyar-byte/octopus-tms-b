import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import roleConfig, { getPageConfig, PageConfig, RoleConfiguration } from '../config/roleConfig';

export function useRoleConfig(page: keyof RoleConfiguration, overrideRole?: string) {
  const { user } = useAuth();
  const role = overrideRole || user?.role || 'BASE';
  
  const config = useMemo(() => {
    return getPageConfig(page, role);
  }, [page, role]);
  
  return config;
}

export function useNavigation(overrideRole?: string) {
  const { user } = useAuth();
  const role = overrideRole || user?.role || 'BASE';
  
  const navigation = useMemo(() => {
    return roleConfig.navigation[role] || [];
  }, [role]);
  
  return navigation;
}