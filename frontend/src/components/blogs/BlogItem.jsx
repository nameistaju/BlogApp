import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BlogItem = ({ blog }) => {
  const { _id, title, content, category, author, createdAt, image } = blog;
  
  const contentPreview = content?.length > 150
    ? `${content.substring(0, 150)}...`
    : content || 'No content available';
    
  const isValidImageUrl = (url) =>
    url &&
    typeof url === 'string' &&
    (url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:image'));
      
  const blogId = _id?.toString() || '';
  
  // Handle different author formats
  const authorName = typeof author === 'object' ? author?.name : author || 'Unknown author';
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition hover:shadow-md duration-300 flex flex-col justify-between">
      {image && isValidImageUrl(image) ? (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://via.placeholder.com/600x400?text=Blog+Image';
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100">
          <span className="text-gray-400 text-4xl">📝</span>
        </div>
      )}
      
      <div className="p-4 flex flex-col gap-3 flex-grow">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {category || 'Uncategorized'}
          </span>
          <span>{createdAt ? format(new Date(createdAt), 'MMM dd, yyyy') : 'Unknown date'}</span>
        </div>
        
        <h2 className="text-lg font-semibold leading-snug text-gray-800">
          <Link to={`/blogs/${blogId}`} className="hover:text-blue-600">
            {title}
          </Link>
        </h2>
        
        <p className="text-sm text-gray-600">{contentPreview}</p>
        
        <div className="border-t mt-4 pt-3 flex items-center justify-between text-sm">
          <span className="text-gray-500 whitespace-nowrap">By {authorName}</span>
          <Link
            to={`/blogs/${blogId}`}
            className="ml-4 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;