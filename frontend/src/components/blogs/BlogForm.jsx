import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const BlogForm = ({ 
  blog, 
  setBlog, 
  onSubmit, 
  buttonText, 
  loading, 
  currentUser 
}) => {
  const { title, content, category, image, author } = blog;
  const [showPreview, setShowPreview] = useState(false);

  const onChange = e => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Preview image helper function
  const isValidImageUrl = (url) => {
    return url && typeof url === 'string' && (
      url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('data:image')
    );
  };

  // Check if an image string is a Base64 encoded image
  const isBase64Image = (str) => {
    return str && typeof str === 'string' && str.startsWith('data:image');
  };

  // Helper function to validate image URL or Base64
  const isValidImage = (src) => {
    return src && (isValidImageUrl(src) || isBase64Image(src));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="title">
            Title*
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter blog title"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="author">
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            value={author || currentUser?.name || ''}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">Author is automatically set to your account name</p>
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="category">
            Category*
          </label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="image">
            Image URL (optional)
          </label>
          <input
            type="text"
            name="image"
            id="image"
            value={image}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {image && (
            <div className="mt-2">
              {isValidImage(image) ? (
                <div className="relative rounded-md overflow-hidden">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="object-cover w-full h-48 rounded-md" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=Invalid+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-medium">Image Preview</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-md">
                  <p className="text-gray-500">Please enter a valid image URL</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium text-gray-700" htmlFor="content">
              Content* <span className="text-xs text-gray-500">(Markdown supported)</span>
            </label>
            <button 
              type="button" 
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showPreview ? 'Edit Content' : 'Preview'}
            </button>
          </div>
          
          {showPreview ? (
            <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 min-h-[250px] prose max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              name="content"
              id="content"
              value={content}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[250px]"
              placeholder="Write your blog content here... Markdown formatting is supported."
            ></textarea>
          )}
          
          <div className="mt-2 flex gap-2 flex-wrap text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded-md"># Heading</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">**Bold**</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">*Italic*</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">[Link](url)</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">![Image](url)</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            buttonText || 'Submit'
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;