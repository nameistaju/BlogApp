import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogContext from '../context/blog/blogContext';
import AlertContext from '../context/alert/alertContext';
import AuthContext from '../context/auth/authContext';
import BlogForm from "../components/blogs/BlogForm";


const CreateBlog = () => {
  const blogContext = useContext(BlogContext);
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  
  const { createBlog } = blogContext;
  const { setAlert } = alertContext;
  const { user } = authContext;
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    
    if (title === '' || content === '') {
      setAlert('Please fill in all required fields', 'error');
    } else {
      setLoading(true);
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
        setAlert('Failed to create blog', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold text-center">Create New Blog</h1>
      <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <BlogForm
          blog={blog}
          setBlog={setBlog}
          onSubmit={onSubmit}
          buttonText="Create Blog"
          loading={loading}
          currentUser={user}
        />
      </div>
    </div>
  );
};

export default CreateBlog;