import { create } from 'zustand';
import { UserRole, CompanyType } from '../types/core/user.types';

interface UserState {
  // User data
  role: UserRole | null;
  companyType: CompanyType | null;
  
  // Actions
  setUserData: (role: UserRole | null, companyType: CompanyType | null) => void;
  clearUserData: () => void;
}

/**
 * Zustand store for user state management
 * Stores user role and company type for access throughout the application
 */
export const useUserStore = create<UserState>((set) => ({
  // Initial state
  role: null,
  companyType: null,
  
  // Actions
  setUserData: (role, companyType) => set({ 
    role, 
    companyType 
  }),
  
  clearUserData: () => set({ 
    role: null, 
    companyType: null 
  }),
}));