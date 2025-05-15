import React, { useContext, useState, useEffect } from 'react';
import BlogContext from '../../context/blog/blogContext';

const BlogFilter = () => {
  const { setFilter, clearFilter, filter } = useContext(BlogContext);
  
  const [localFilter, setLocalFilter] = useState({
    category: '',
    author: ''
  });

  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  const onChange = e => {
    setLocalFilter({ ...localFilter, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    setFilter(localFilter);
  };

  const onClear = () => {
    setLocalFilter({ category: '', author: '' });
    clearFilter();
  };

  // Common category options
  const categories = [
    'Technology',
    'Health',
    'Education',
    'Travel',
    'Food',
    'Lifestyle',
    'Business',
    'Sports',
    'Entertainment',
    'Other'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Blogs</h3>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
              Category
            </label>
            <select
              className="form-control"
              name="category"
              value={localFilter.category}
              onChange={onChange}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="author">
              Author
            </label>
            <input
              type="text"
              className="form-control"
              name="author"
              value={localFilter.author}
              onChange={onChange}
              placeholder="Search by author name"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Apply Filter
          </button>
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogFilter;