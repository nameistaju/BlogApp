import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';

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

const API_BASE = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE) throw new Error("VITE_API_BASE_URL is undefined. Please check your .env file.");

// ✅ Helper: Set or remove token from Axios
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('JWT decoding failed:', err);
    return null;
  }
};

const AuthState = ({ children }) => {
  const initialState = {
    token: null,
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // ✅ Load user from backend
  const loadUser = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/user`);
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      console.error("Load user failed:", err);
      dispatch({
        type: AUTH_ERROR,
        payload: err.response?.data?.message || 'Failed to load user',
      });
    }
  };

  // ✅ Register user
  const register = async (formData) => {
    dispatch({ type: SET_LOADING });
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
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

  // ✅ Login user
  const login = async (formData) => {
    dispatch({ type: SET_LOADING });
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
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

  const logout = () => {
    setAuthToken(null);
    dispatch({ type: LOGOUT });
  };

  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // ✅ On mount, validate token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setAuthToken(token);
        dispatch({ type: LOGIN_SUCCESS, payload: { token } });
        loadUser();
      } else {
        logout();
      }
    } else {
      dispatch({ type: AUTH_ERROR, payload: 'No token found' });
    }
  }, []);

  // ✅ Debug logs
  // console.log("AuthContext.Provider state:", state);
  // console.log("API_BASE from env:", API_BASE);

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
