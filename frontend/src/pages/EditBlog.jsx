import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogContext from '../context/blog/blogContext';
import AlertContext from '../context/alert/alertContext';
import AuthContext from '../context/auth/authContext';
import Spinner from '../components/layout/Spinner';
import BlogForm from "../components/blogs/BlogForm";


const EditBlog = () => {
  const blogContext = useContext(BlogContext);
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  
  const { getBlog, updateBlog, currentBlog, clearCurrent, loading } = blogContext;
  const { setAlert } = alertContext;
  const { user } = authContext;
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    category: 'Technology',
    image: '',
    author: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (getBlog && typeof getBlog === 'function') {
      getBlog(id);
    }
    
    return () => clearCurrent();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (currentBlog) {
      // Check if current user is author
      if (user && currentBlog.userId && currentBlog.userId.toString() !== user._id) {
        setUnauthorized(true);
        setAlert('You are not authorized to edit this blog', 'error');
        setTimeout(() => navigate('/blogs/' + id), 2000);
        return;
      }

      setBlog({
        title: currentBlog.title || '',
        content: currentBlog.content || '',
        category: currentBlog.category || 'Technology',
        image: currentBlog.image || '',
        author: currentBlog.author || (user ? user.name : '')
      });
    }
  }, [currentBlog, user, id, navigate, setAlert]);

  const onSubmit = async e => {
    e.preventDefault();
    const { title, content } = blog;
    
    if (title === '' || content === '') {
      setAlert('Please fill in all required fields', 'error');
    } else {
      setSubmitting(true);
      try {
        // Ensure author field is preserved
        const blogData = {
          ...blog,
          author: blog.author || currentBlog.author || (user ? user.name : '')
        };
        
        await updateBlog(id, blogData);
        setAlert('Blog updated successfully', 'success');
        navigate('/my-blogs');
      } catch (error) {
        setAlert('Failed to update blog', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="p-4 mx-auto mt-8 text-center bg-red-100 border border-red-400 rounded max-w-md">
        <p className="text-red-700">You are not authorized to edit this blog.</p>
        <p className="mt-2 text-gray-700">Redirecting to blog details...</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Edit Blog</h1>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <BlogForm
          blog={blog}
          setBlog={setBlog}
          onSubmit={onSubmit}
          buttonText="Update Blog"
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

export default EditBlog;