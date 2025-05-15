import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';
import AlertContext from '../context/alert/alertContext';
import Spinner from '../components/layout/Spinner';

const Signup = () => {
  const navigate = useNavigate();
  const { register, error, clearErrors, isAuthenticated, loading } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const { name, email, password, passwordConfirm } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    
    if (name === '' || email === '' || password === '') {
      setAlert('Please fill in all fields', 'error');
    } else if (password !== passwordConfirm) {
      setAlert('Passwords do not match', 'error');
    } else if (password.length < 6) {
      setAlert('Password must be at least 6 characters', 'error');
    } else {
      register({
        name,
        email,
        password
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              minLength="6"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="passwordConfirm">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={onChange}
              placeholder="Confirm your password"
              minLength="6"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary mb-4"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;