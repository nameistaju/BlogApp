import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT } from './alertTypes';

const AlertState = ({ children }) => {
  const initialState = [];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuidv4();
    
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id }
    });

    // Show toast notification
    if (type === 'error') {
      toast.error(msg);
    } else if (type === 'success') {
      toast.success(msg);
    } else {
      toast.info(msg);
    }

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;