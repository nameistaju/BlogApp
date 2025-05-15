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

const blogReducer = (state, action) => {
  switch (action.type) {
    case GET_BLOGS:
      // Load all blogs
      return {
        ...state,
        blogs: action.payload,
        loading: false,
        error: null,
      };
    case GET_BLOG:
      // Load single blog
      return {
        ...state,
        currentBlog: action.payload,
        loading: false,
        error: null,
      };
    case GET_USER_BLOGS:
      // Load blogs created by current user
      return {
        ...state,
        userBlogs: action.payload,
        loading: false,
        error: null,
      };
    case ADD_BLOG:
      // Add new blog to lists
      return {
        ...state,
        blogs: [action.payload, ...state.blogs],
        userBlogs: [action.payload, ...state.userBlogs],
        loading: false,
        error: null,
      };
    case UPDATE_BLOG:
      // Update blog in lists and currentBlog
      return {
        ...state,
        blogs: state.blogs.map(blog =>
          blog._id === action.payload._id ? action.payload : blog
        ),
        userBlogs: state.userBlogs.map(blog =>
          blog._id === action.payload._id ? action.payload : blog
        ),
        currentBlog: action.payload,
        loading: false,
        error: null,
      };
    case DELETE_BLOG:
      // Remove blog from lists
      return {
        ...state,
        blogs: state.blogs.filter(blog => blog._id !== action.payload),
        userBlogs: state.userBlogs.filter(blog => blog._id !== action.payload),
        loading: false,
        error: null,
      };
    case BLOG_ERROR:
      // Set error
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CLEAR_CURRENT:
      // Clear current blog selection
      return {
        ...state,
        currentBlog: null,
      };
    case SET_LOADING:
      // Set loading state
      return {
        ...state,
        loading: true,
      };
    case CLEAR_ERRORS:
      // Clear errors
      return {
        ...state,
        error: null,
      };
    case SET_FILTER:
      // Set blog filters
      return {
        ...state,
        filter: action.payload,
      };
    case CLEAR_FILTER:
      // Clear blog filters
      return {
        ...state,
        filter: { category: '', author: '' },
      };
    default:
      return state;
  }
};

export default blogReducer;
