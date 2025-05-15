import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import App from './App';
import AuthState from './context/auth/AuthState';
import BlogState from './context/blog/BlogState';
import AlertState from './context/alert/AlertState';
import ErrorBoundary from './components/ErrorBoundary';

const Root = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <AuthState>
        <BlogState>
          <AlertState>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AlertState>
        </BlogState>
      </AuthState>
    </ErrorBoundary>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
