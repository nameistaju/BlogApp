import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Show spinner while loading auth state
  if (loading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Redirect only if explicitly not authenticated
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
