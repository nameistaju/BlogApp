import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogContext from '../context/blog/blogContext';
import AuthContext from '../context/auth/authContext';
import BlogList from '../components/blogs/BlogList';
import BlogFilter from '../components/blogs/BlogFilter';

const Home = () => {
  const { blogs, loading: blogsLoading, getBlogs } = useContext(BlogContext);
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && blogs.length === 0) {
      getBlogs();
    }
  }, [isAuthenticated, blogs.length, getBlogs]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-700 animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Blog App</h2>
          <p className="text-gray-600 mb-6">Please log in or sign up to view the latest blogs.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Latest Blogs</h2>
        <div className="mb-6">
          <BlogFilter />
        </div>
        <BlogList blogs={blogs} loading={blogsLoading} />
      </div>
    </main>
  );
};

export default Home;
