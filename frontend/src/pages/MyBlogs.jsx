import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogContext from '../context/blog/blogContext';
import UserBlogItem from '../components/blogs/UserBlogItem';
import Spinner from '../components/layout/Spinner';

const MyBlogs = () => {
  const blogContext = useContext(BlogContext);
  const { getUserBlogs, userBlogs, loading } = blogContext;

  useEffect(() => {
    getUserBlogs();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800 md:mb-0">
          My Blogs
        </h1>
        <Link 
          to="/create-blog" 
          className="px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Blog
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full py-12">
          <Spinner />
        </div>
      ) : userBlogs.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <svg 
            className="w-16 h-16 mx-auto mb-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">No blogs yet</h2>
          <p className="mb-6 text-gray-600">You haven't created any blogs yet. Start writing your first blog!</p>
          <Link 
            to="/create-blog" 
            className="px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userBlogs.map(blog => (
            <UserBlogItem key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;