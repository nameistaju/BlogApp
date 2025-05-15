import React, { useReducer } from 'react';
import axios from 'axios';
import BlogContext from './blogContext';
import blogReducer from './blogReducer';
import {
  GET_BLOGS,
  GET_BLOG,
  GET_USER_BLOGS,
  ADD_BLOG,
  UPDATE_BLOG,
  DELETE_BLOG,
  BLOG_ERROR,
  CLEAR_CURRENT,
  SET_LOADING,
  CLEAR_ERRORS,
  SET_FILTER,
  CLEAR_FILTER
} from './blogTypes';

const BlogState = ({ children }) => {
  const initialState = {
    blogs: [],
    userBlogs: [],
    currentBlog: null,
    loading: true,
    error: null,
    filter: {
      category: '',
      author: ''
    }
  };

  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Get all blogs with optional filters
  const getBlogs = async (filters = {}) => {
    dispatch({ type: SET_LOADING });

    let url = 'http://localhost:5000/api/blogs';
    
    const queryParams = [];
    if (filters.category) queryParams.push(`category=${filters.category}`);
    if (filters.author) queryParams.push(`author=${filters.author}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    try {
      const res = await axios.get(url);
      
      dispatch({
        type: GET_BLOGS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Failed to fetch blogs'
      });
    }
  };

  // Get single blog by ID
  const getBlogById = async (id) => {
    dispatch({ type: SET_LOADING });

    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      
      dispatch({
        type: GET_BLOG,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Failed to fetch blog'
      });
    }
  };

  // Get current user's blogs
  const getUserBlogs = async () => {
    dispatch({ type: SET_LOADING });

    try {
      const res = await axios.get('http://localhost:5000/api/blogs/user/me');
      
      dispatch({
        type: GET_USER_BLOGS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Failed to fetch your blogs'
      });
    }
  };

  // Create new blog
  const createBlog = async (blogData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    dispatch({ type: SET_LOADING });

    try {
      const res = await axios.post('http://localhost:5000/api/blogs', blogData, config);
      
      dispatch({
        type: ADD_BLOG,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Failed to create blog'
      });
      throw err;
    }
  };

  // Update blog
  const updateBlog = async (id, blogData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    dispatch({ type: SET_LOADING });

    try {
      const res = await axios.put(`http://localhost:5000/api/blogs/${id}`, blogData, config);
      
      dispatch({
        type: UPDATE_BLOG,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Failed to update blog'
      });
      throw err;
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    dispatch({ type: SET_LOADING });

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      
      dispatch({
        type: DELETE_BLOG,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Failed to delete blog'
      });
    }
  };

  // Clear current blog
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Set filter
  const setFilter = (filter) => {
    dispatch({
      type: SET_FILTER,
      payload: filter
    });
    
    getBlogs(filter);
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
    getBlogs();
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <BlogContext.Provider
      value={{
        blogs: state.blogs,
        userBlogs: state.userBlogs,
        currentBlog: state.currentBlog,
        loading: state.loading,
        error: state.error,
        filter: state.filter,
        getBlogs,
        getBlogById,
        getUserBlogs,
        createBlog,
        updateBlog,
        deleteBlog,
        clearCurrent,
        setFilter,
        clearFilter,
        clearErrors
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogState;