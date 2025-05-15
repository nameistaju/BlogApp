import React, { useContext, useEffect, useState, useCallback } from 'react';
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

  const { getBlogById, deleteBlog, currentBlog, loading, clearCurrent, error } = blogContext;
  const { user } = authContext;
  const { setAlert } = alertContext;

  const { id } = useParams();
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // Fetch blog data with proper error handling
  const fetchBlogData = useCallback(async () => {
    if (!id) {
      setFetchError(true);
      setAlert('Invalid blog ID', 'error');
      return;
    }

    try {
      await getBlogById(id);
      setFetchError(false);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setFetchError(true);
      setAlert('Error loading blog details', 'error');
    }
  }, [id, getBlogById, setAlert]);

  useEffect(() => {
    // Fetch blog data when component mounts
    fetchBlogData();

    // Cleanup function to run when component unmounts
    return () => {
      if (typeof clearCurrent === 'function') {
        clearCurrent();
      }
    };
  }, [fetchBlogData, clearCurrent]);

  // Monitor error state from context
  useEffect(() => {
    if (error) {
      setFetchError(true);
    }
  }, [error]);

  const onDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setDeleting(true);
      try {
        await deleteBlog(id);
        setAlert('Blog deleted successfully', 'success');
        navigate('/my-blogs');
      } catch (error) {
        console.error('Error deleting blog:', error);
        setAlert('Failed to delete blog', 'error');
        setDeleting(false);
      }
    }
  };

  if (fetchError) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog</h2>
            <p className="mb-4">Unable to load blog details. Please try again later.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={fetchBlogData} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
              <Link to="/" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !currentBlog) {
    return <Spinner />;
  }

  const {
    title = 'Untitled',
    content = '',
    category = 'Uncategorized',
    author,
    createdAt,
    image,
    userId,
  } = currentBlog || {};

  const isOwner = user && user._id === userId;

  const isValidImageUrl = (url) =>
  url &&
  typeof url === 'string' &&
  (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'));


  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            &larr; Back to Blogs
          </Link>
        </div>

        <article className="p-6 bg-white rounded-lg shadow-md">
          {image && isValidImageUrl(image) ? (
            <div className="mb-6">
              <img
                src={image}
                alt={title}
                className="object-cover w-full h-64 rounded-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
          ) : (
            <div className="mb-6 flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
              <span className="text-gray-400 text-6xl select-none">📝</span>
            </div>
          )}

          <header className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">{title}</h1>
            <div className="flex flex-wrap items-center mb-2 text-gray-600 gap-x-4">
              <span>
                <span className="font-medium">Author:</span> {author?.name ?? 'Unknown Author'}
              </span>
              <span>
                <span className="font-medium">Category:</span> {category}
              </span>
              <span>
                <span className="font-medium">Published:</span>{' '}
                {createdAt ? format(new Date(createdAt), 'MMMM dd, yyyy') : 'Unknown date'}
              </span>
            </div>

            {isOwner && (
              <div className="flex space-x-3 mt-2">
                <Link
                  to={`/edit-blog/${id}`}
                  className={`px-3 py-1 text-sm text-white rounded ${
                    deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  aria-disabled={deleting}
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
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;