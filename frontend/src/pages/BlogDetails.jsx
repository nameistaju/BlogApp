import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import BlogContext from '../context/blog/blogContext';
import AuthContext from '../context/auth/authContext';
import AlertContext from '../context/alert/alertContext';
import Spinner from '../components/layout/Spinner';
import ReactMarkdown from 'react-markdown';

const BlogDetails = () => {
  const blogContext = useContext(BlogContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  
  // Fixed: Using getBlogById instead of getBlog
  const { getBlogById, deleteBlog, currentBlog, loading, clearCurrent } = blogContext;
  const { user } = authContext;
  const { setAlert } = alertContext;
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Make sure to call getBlogById with the id parameter
    if (id && getBlogById && typeof getBlogById === 'function') {
      getBlogById(id);
    }
    
    // Cleanup function
    return () => {
      if (clearCurrent && typeof clearCurrent === 'function') {
        clearCurrent();
      }
    };
  }, [id]); // Only id as dependency to avoid infinite loops

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setDeleting(true);
      try {
        await deleteBlog(id);
        setAlert('Blog deleted successfully', 'success');
        navigate('/my-blogs');
      } catch (error) {
        setAlert('Failed to delete blog', 'error');
        setDeleting(false);
      }
    }
  };

  if (loading || !currentBlog) {
    return <Spinner />;
  }

  const { title, content, category, author, createdAt, image, userId } = currentBlog;
  const isOwner = user && userId === user._id;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            &larr; Back to Blogs
          </Link>
        </div>
        
        <article className="p-6 bg-white rounded-lg shadow-md">
          {image && (
            <div className="mb-6">
              <img 
                src={image} 
                alt={title} 
                className="object-cover w-full h-64 rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
          )}
          
          <header className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">{title}</h1>
            <div className="flex flex-wrap items-center mb-2 text-gray-600">
              <span className="mr-4">
                <span className="font-medium">Author:</span> {author?.name || 'Unknown Author'}
              </span>
              <span className="mr-4">
                <span className="font-medium">Category:</span> {category || 'Uncategorized'}
              </span>
              <span>
                <span className="font-medium">Published:</span> {createdAt ? format(new Date(createdAt), 'MMMM dd, yyyy') : 'Unknown date'}
              </span>
            </div>
            
            {isOwner && (
              <div className="flex space-x-3 mt-2">
                <Link 
                  to={`/edit-blog/${id}`} 
                  className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button 
                  onClick={onDelete} 
                  disabled={deleting}
                  className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </header>
          
          <div className="prose max-w-none">
            <ReactMarkdown>{content || ''}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;