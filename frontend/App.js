import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import MyBlogs from './pages/MyBlogs';
import BlogDetails from './pages/BlogDetails';

// Context
import AuthState from './context/auth/AuthState';
import BlogState from './context/blog/BlogState';
import AlertState from './context/alert/AlertState';

const App = () => {
  return (
    <AuthState>
      <BlogState>
        <AlertState>
          <Router>
            <Navbar />
            <div className="container py-4">
              <ToastContainer position="top-right" autoClose={3000} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/blogs/:id" element={<BlogDetails />} />
                <Route
                  path="/create-blog"
                  element={
                    <PrivateRoute>
                      <CreateBlog />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit-blog/:id"
                  element={
                    <PrivateRoute>
                      <EditBlog />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-blogs"
                  element={
                    <PrivateRoute>
                      <MyBlogs />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </AlertState>
      </BlogState>
    </AuthState>
  );
};

export default App;