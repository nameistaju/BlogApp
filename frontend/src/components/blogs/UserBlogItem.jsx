import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import BlogContext from '../../context/blog/blogContext';
import AlertContext from '../../context/alert/alertContext';

const UserBlogItem = ({ blog }) => {
  const { deleteBlog } = useContext(BlogContext);
  const { setAlert } = useContext(AlertContext);
  
  const { _id, title, content, category, createdAt, image } = blog;
  
  const contentPreview = content?.length > 150 ? `${content.substring(0, 150)}...` : content;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(_id);
      setAlert('Blog deleted successfully', 'success');
    }
  };

  // Check if the image URL is valid
  const isValidImageUrl = (url) => {
    return url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'));
  };

  // Ensure _id is available
  const blogId = _id?.toString() || '';
  
  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg mb-6">
      {image && isValidImageUrl(image) ? (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              // Use a working placeholder service
              e.target.src = 'https://via.placeholder.com/600x400?text=Blog+Image';
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100">
          <span className="text-gray-400 text-4xl">📝</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            {category || 'Uncategorized'}
          </span>
          <span className="text-sm text-gray-500">
            {createdAt ? format(new Date(createdAt), 'MMM dd, yyyy') : 'Unknown date'}
          </span>
        </div>
        
        <h2 className="mb-3 text-xl font-bold text-gray-800">{title}</h2>
        
        {content && <p className="mb-4 text-gray-600">{contentPreview}</p>}
        
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {blogId && (
              <Link
                to={`/blogs/${blogId}`}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                View
              </Link>
            )}
            {blogId && (
              <Link
                to={`/edit-blog/${blogId}`}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
            )}
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
          <span className="text-xs text-gray-500">ID: {_id && _id.substring(0, 6)}...</span>
        </div>
      </div>
    </div>
  );
};

export default UserBlogItem;