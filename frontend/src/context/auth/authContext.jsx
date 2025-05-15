import { createContext } from 'react';

const AuthContext = createContext({
  token: null,
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
  register: () => {},
  login: () => {},
  logout: () => {},
  clearErrors: () => {},
  loadUser: () => {},
});

export default AuthContext;