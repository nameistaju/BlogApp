import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogContext from '../context/blog/blogContext';
import AlertContext from '../context/alert/alertContext';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getBlogById, updateBlog, currentBlog } = useContext(BlogContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const fetch = async () => {
      await getBlogById(id);
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (currentBlog) {
      setFormData({
        title: currentBlog.title || '',
        content: currentBlog.content || '',
        category: currentBlog.category || '',
        image: currentBlog.image || '',
      });
      setPreview(currentBlog.image || '');
      setLoading(false);
    }
  }, [currentBlog]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'image') {
      setPreview(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      setAlert('All fields are required', 'error');
      return;
    }

    try {
      await updateBlog(id, formData);
      setAlert('Blog updated successfully!', 'success');
      navigate(`/blogs/${id}`);
    } catch (err) {
      setAlert('Failed to update blog', 'error');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={onChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={onChange}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          name="content"
          placeholder="Content (Markdown supported)"
          rows="10"
          value={formData.content}
          onChange={onChange}
          className="w-full p-3 border rounded"
          required
        ></textarea>

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={onChange}
          className="w-full p-3 border rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded border"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400?text=Invalid+Image';
            }}
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
