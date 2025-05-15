import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle token expiration or unauthorized requests
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  }
};

// Blog services
export const blogService = {
  getBlogs: async (filters = {}) => {
    const response = await api.get('/blogs', { params: filters });
    return response.data;
  },
  
  getUserBlogs: async () => {
    const response = await api.get('/blogs/user/me');
    return response.data;
  },
  
  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },
  
  createBlog: async (blogData) => {
    // For multipart/form-data (if uploading image)
    const formData = new FormData();
    Object.keys(blogData).forEach(key => {
      formData.append(key, blogData[key]);
    });
    
    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  updateBlog: async (id, blogData) => {
    // For multipart/form-data (if uploading image)
    const formData = new FormData();
    Object.keys(blogData).forEach(key => {
      if (blogData[key] !== null) {
        formData.append(key, blogData[key]);
      }
    });
    
    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  }
};

export default api;