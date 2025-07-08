import { useContext } from 'react';
import { AuthenticationContext } from './authentication-provider';


/**
 * Hook for accessing the current authentication status.
 */
export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

export default useAuthentication;
