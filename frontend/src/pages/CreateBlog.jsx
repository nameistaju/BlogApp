import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BlogContext from '../context/blog/blogContext';
import AlertContext from '../context/alert/alertContext';
import AuthContext from '../context/auth/authContext';
import BlogForm from "../components/blogs/BlogForm";
import Spinner from '../components/layout/Spinner';

const CreateBlog = () => {
  const blogContext = useContext(BlogContext);
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  
  const { createBlog, loading: contextLoading } = blogContext;
  const { setAlert } = alertContext;
  const { user } = authContext;
  
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    category: 'Technology',
    image: '',
    author: ''
  });

  // Set author when user data is loaded
  useEffect(() => {
    if (user) {
      setBlog(prevState => ({
        ...prevState,
        author: user.name
      }));
    }
  }, [user]);

  const onSubmit = async e => {
    e.preventDefault();
    const { title, content } = blog;
    
    if (title.trim() === '' || content.trim() === '') {
      setAlert('Please fill in all required fields', 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      // Make sure author is included
      const blogData = {
        ...blog,
        author: blog.author || (user ? user.name : '')
      };
      
      await createBlog(blogData);
      setAlert('Blog created successfully', 'success');
      navigate('/my-blogs');
    } catch (error) {
      setAlert(error.message || 'Failed to create blog', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading spinner when context is loading or during submission
  const isLoading = contextLoading || submitting;

  if (isLoading && !blog.title && !blog.content) {
    return (
      <div className="flex items-center justify-center w-full min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="mb-6">
        <Link to="/my-blogs" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to My Blogs
        </Link>
      </div>
      
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Create New Blog</h1>
      
      <div className="p-6 bg-white rounded-lg shadow-md">
        <BlogForm
          blog={blog}
          setBlog={setBlog}
          onSubmit={onSubmit}
          buttonText="Create Blog"
          loading={submitting}
          currentUser={user}
        />
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/my-blogs')}
            className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;