import React from 'react';
import BlogItem from './BlogItem';
import Spinner from '../layout/Spinner';

const BlogList = ({ blogs = [], loading }) => {
  if (loading) {
    return <Spinner />;
  }

  if (!blogs.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map(blog => (
        <BlogItem key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
