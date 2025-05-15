import React from 'react';

const BlogForm = ({ 
  blog, 
  setBlog, 
  onSubmit, 
  buttonText, 
  loading, 
  currentUser 
}) => {
  const { title, content, category, image, author } = blog;

  const onChange = e => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Preview image helper function
  const isValidImageUrl = (url) => {
    return url && url.match(/^(http|https):\/\/[^ "]+$/);
  };

  // Check if an image string is a Base64 encoded image
  const isBase64Image = (str) => {
    return str && typeof str === 'string' && str.startsWith('data:image');
  };

  // Helper function to validate image URL or Base64
  const isValidImage = (src) => {
    return src && (src.startsWith('http') || isBase64Image(src));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
          placeholder="Enter blog title"
        />
      </div>
      
      <div className="mb-4">
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
      
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700" htmlFor="category">
          Category*
        </label>
        <select
          name="category"
          id="category"
          value={category}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
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
      
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700" htmlFor="image">
          Image URL (optional)
        </label>
        <input
          type="text"
          name="image"
          id="image"
          value={image}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
          placeholder="https://example.com/image.jpg"
        />
        {image && (
          <div className="mt-2">
            {isValidImage(image) ? (
              <img 
                src={image} 
                alt="Preview" 
                className="object-cover w-full h-40 rounded-md" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/api/placeholder/400/200?text=Invalid+Image';
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-md">
                <p className="text-gray-500">Please enter a valid image URL</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700" htmlFor="content">
          Content*
        </label>
        <textarea
          name="content"
          id="content"
          value={content}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 min-h-[250px]"
          placeholder="Write your blog content here..."
        ></textarea>
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : buttonText || 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;