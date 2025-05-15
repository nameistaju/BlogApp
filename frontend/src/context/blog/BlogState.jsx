import React, { useReducer, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import BlogContext from './blogContext';
import blogReducer from './blogReducer';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
  CLEAR_FILTER,
} from './blogTypes';

const BlogState = ({ children }) => {
  const initialState = {
    blogs: [],
    userBlogs: [],
    currentBlog: null,
    loading: false, // start false to avoid loading spinner on mount
    error: null,
    filter: {
      category: '',
      author: '',
    },
  };

  const [state, dispatch] = useReducer(blogReducer, initialState);
  
  // Keep track of pending requests to prevent duplicates
  const pendingRequests = useRef(new Map());
  
  // Create a ref for the AbortController to cancel requests when component unmounts
  const controllerRef = useRef(new AbortController());
  
  // Create a cache for blog data to reduce API calls
  const blogCache = useRef(new Map());

  // Helper for setting headers including token if available
  const getConfig = useCallback((options = {}) => {
    const token = localStorage.getItem('token');
    
    return {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }),
      },
      signal: controllerRef.current.signal,
      timeout: 15000, // 15 second timeout
      ...options
    };
  }, []);

  // Helper function to track API requests
  const trackRequest = useCallback((requestId, promise) => {
    // If request is already pending, return the existing promise
    if (pendingRequests.current.has(requestId)) {
      return pendingRequests.current.get(requestId);
    }
    
    // Track the new request
    pendingRequests.current.set(requestId, promise);
    
    // Remove from tracking once completed
    promise.finally(() => {
      pendingRequests.current.delete(requestId);
    });
    
    return promise;
  }, []);

  const getBlogs = useCallback(async (filters = {}) => {
    const requestId = `getBlogs-${JSON.stringify(filters)}`;
    
    // Create a new request promise
    const fetchPromise = (async () => {
      dispatch({ type: SET_LOADING });
      let url = `${API_BASE}/api/blogs`;

      const queryParams = [];
      if (filters.category) queryParams.push(`category=${filters.category}`);
      if (filters.author) queryParams.push(`author=${filters.author}`);
      if (queryParams.length) url += `?${queryParams.join('&')}`;

      try {
        const res = await axios.get(url, getConfig());
        dispatch({ type: GET_BLOGS, payload: res.data });
        
        // Cache individual blogs for quicker access
        res.data.forEach(blog => {
          blogCache.current.set(blog._id, blog);
        });
        
        return res.data;
      } catch (err) {
        // Don't dispatch error for cancelled requests
        if (!axios.isCancel(err)) {
          console.error('Error fetching blogs:', err);
          dispatch({
            type: BLOG_ERROR,
            payload: err.response?.data?.message || 'Failed to fetch blogs',
          });
        }
        throw err;
      }
    })();
    
    return trackRequest(requestId, fetchPromise);
  }, [getConfig, trackRequest]);

  const getBlogById = useCallback(async (id) => {
    const requestId = `getBlogById-${id}`;
    
    // If blog is in cache and was fetched recently, return it
    if (blogCache.current.has(id)) {
      const cachedBlog = blogCache.current.get(id);
      dispatch({ type: GET_BLOG, payload: cachedBlog });
      return Promise.resolve(cachedBlog);
    }
    
    // Create a new request promise
    const fetchPromise = (async () => {
      dispatch({ type: SET_LOADING });
      
      try {
        const res = await axios.get(`${API_BASE}/api/blogs/${id}`, getConfig());
        
        // Cache the blog
        blogCache.current.set(id, res.data);
        
        dispatch({ type: GET_BLOG, payload: res.data });
        return res.data;
      } catch (err) {
        // Don't dispatch error for cancelled requests
        if (!axios.isCancel(err)) {
          console.error(`Error fetching blog with ID ${id}:`, err);
          dispatch({
            type: BLOG_ERROR,
            payload: err.response?.data?.message || 'Failed to fetch blog',
          });
        }
        throw err;
      }
    })();
    
    return trackRequest(requestId, fetchPromise);
  }, [getConfig, trackRequest]);

  const getUserBlogs = useCallback(async () => {
    const requestId = 'getUserBlogs';
    
    // Create a new request promise
    const fetchPromise = (async () => {
      dispatch({ type: SET_LOADING });
      
      try {
        const res = await axios.get(`${API_BASE}/api/blogs/user/me`, getConfig());
        
        // Cache user blogs for quicker access
        res.data.forEach(blog => {
          blogCache.current.set(blog._id, blog);
        });
        
        dispatch({ type: GET_USER_BLOGS, payload: res.data });
        return res.data;
      } catch (err) {
        // Don't dispatch error for cancelled requests
        if (!axios.isCancel(err)) {
          console.error('Error fetching user blogs:', err);
          dispatch({
            type: BLOG_ERROR,
            payload: err.response?.data?.message || 'Failed to fetch your blogs',
          });
        }
        throw err;
      }
    })();
    
    return trackRequest(requestId, fetchPromise);
  }, [getConfig, trackRequest]);

  const createBlog = useCallback(async (blogData) => {
    const requestId = `createBlog-${Date.now()}`;
    
    // Create a new request promise
    const fetchPromise = (async () => {
      dispatch({ type: SET_LOADING });
      
      try {
        const res = await axios.post(
          `${API_BASE}/api/blogs`, 
          blogData, 
          getConfig({ timeout: 30000 }) // 30 second timeout for uploads
        );
        
        // Cache the newly created blog
        blogCache.current.set(res.data._id, res.data);
        
        dispatch({ type: ADD_BLOG, payload: res.data });
        return res.data;
      } catch (err) {
        // Don't dispatch error for cancelled requests
        if (!axios.isCancel(err)) {
          console.error('Error creating blog:', err);
          dispatch({
            type: BLOG_ERROR,
            payload: err.response?.data?.message || 'Failed to create blog',
          });
        }
        throw err;
      }
    })();
    
    return trackRequest(requestId, fetchPromise);
  }, [getConfig, trackRequest]);

  const updateBlog = useCallback(async (id, blogData) => {
    const requestId = `updateBlog-${id}-${Date.now()}`;
    
    // Create a new request promise
    const fetchPromise = (async () => {
      dispatch({ type: SET_LOADING });
      
      try {
        const res = await axios.put(
          `${API_BASE}/api/blogs/${id}`, 
          blogData, 
          getConfig({ timeout: 30000 }) // 30 second timeout for uploads
        );
        
        // Update the cached blog
        blogCache.current.set(id, res.data);
        
        dispatch({ type: UPDATE_BLOG, payload: res.data });
        return res.data;
      } catch (err) {
        // Don't dispatch error for cancelled requests
        if (!axios.isCancel(err)) {
          console.error(`Error updating blog with ID ${id}:`, err);
          dispatch({
            type: BLOG_ERROR,
            payload: err.response?.data?.message || 'Failed to update blog',
          });
        }
        throw err;
      }
    })();
    
    return trackRequest(requestId, fetchPromise);
  }, [getConfig, trackRequest]);

  const deleteBlog = useCallback(async (id) => {
    const requestId = `deleteBlog-${id}`;
    
    // Create a new request promise
    const fetchPromise = (async () => {
      dispatch({ type: SET_LOADING });
      
      try {
        await axios.delete(`${API_BASE}/api/blogs/${id}`, getConfig());
        
        // Remove from cache
        blogCache.current.delete(id);
        
        dispatch({ type: DELETE_BLOG, payload: id });
        return true;
      } catch (err) {
        // Don't dispatch error for cancelled requests
        if (!axios.isCancel(err)) {
          console.error(`Error deleting blog with ID ${id}:`, err);
          dispatch({
            type: BLOG_ERROR,
            payload: err.response?.data?.message || 'Failed to delete blog',
          });
        }
        throw err;
      }
    })();
    
    return trackRequest(requestId, fetchPromise);
  }, [getConfig, trackRequest]);

  const clearCurrent = useCallback(() => {
    dispatch({ type: CLEAR_CURRENT });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: SET_FILTER, payload: filter });
    getBlogs(filter);
  }, [getBlogs]);

  const clearFilter = useCallback(() => {
    dispatch({ type: CLEAR_FILTER });
    getBlogs();
  }, [getBlogs]);

  const clearErrors = useCallback(() => {
    dispatch({ type: CLEAR_ERRORS });
  }, []);

  // Cancel all pending requests when component unmounts
  useEffect(() => {
    return () => {
      // Abort any pending requests
      controllerRef.current.abort();
      // Create a new controller for any future requests
      controllerRef.current = new AbortController();
      // Clear pending requests map
      pendingRequests.current.clear();
    };
  }, []);

  // Limit cache size to prevent memory leaks
  useEffect(() => {
    const interval = setInterval(() => {
      if (blogCache.current.size > 100) {
        // Keep only the 50 most recent items
        const entries = Array.from(blogCache.current.entries());
        const toKeep = entries.slice(-50);
        blogCache.current = new Map(toKeep);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

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
        clearErrors,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogState;