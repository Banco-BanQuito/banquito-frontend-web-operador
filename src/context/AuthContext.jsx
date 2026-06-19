import { useMemo } from 'react';
import { AuthContext } from './authContextObject';

const DIRECT_OPERATOR_AUTH = {
  isAuthenticated: true,
  portal: 'operador',
  user: null,
};

export function AuthProvider({ children }) {
  const auth = useMemo(() => ({
    ...DIRECT_OPERATOR_AUTH,
    login: async () => DIRECT_OPERATOR_AUTH.user,
    logout: () => {},
  }), []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
