import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AuthContext from './authContext';
import authReducer from './authReducer';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  SET_LOADING,
} from './authTypes';

// Helper function to set or remove token from Axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

const AuthState = ({ children }) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user if token exists
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      try {
        const res = await axios.get(`${API_BASE}/api/auth/user`);

        dispatch({ type: USER_LOADED, payload: res.data });
      } catch (err) {
        dispatch({
          type: AUTH_ERROR,
          payload: err.response?.data?.message || 'Failed to load user',
        });
      }
    }
  };

  // Register user
  const register = async (formData) => {
    dispatch({ type: SET_LOADING });
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/signup`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      setAuthToken(res.data.token);
      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || 'Registration failed',
      });
    }
  };

  // Login user
  const login = async (formData) => {
    dispatch({ type: SET_LOADING });
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      setAuthToken(res.data.token);
      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.message || 'Invalid credentials',
      });
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    dispatch({ type: LOGOUT });
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // Check token validity on mount
  useEffect(() => {
    if (state.token) {
      try {
        const decoded = jwtDecode(state.token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setAuthToken(state.token);
          loadUser();
        }
      } catch (err) {
        logout();
      }
    } else {
      dispatch({ type: AUTH_ERROR });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
