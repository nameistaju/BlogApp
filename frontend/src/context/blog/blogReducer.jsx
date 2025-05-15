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
      return {
        ...state,
        blogs: action.payload,
        loading: false,
        error: null
      };
    case GET_BLOG:
      return {
        ...state,
        currentBlog: action.payload,
        loading: false,
        error: null
      };
    case GET_USER_BLOGS:
      return {
        ...state,
        userBlogs: action.payload,
        loading: false,
        error: null
      };
    case ADD_BLOG:
      return {
        ...state,
        blogs: [action.payload, ...state.blogs],
        userBlogs: [action.payload, ...state.userBlogs],
        loading: false,
        error: null
      };
    case UPDATE_BLOG:
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
        error: null
      };
    case DELETE_BLOG:
      return {
        ...state,
        blogs: state.blogs.filter(blog => blog._id !== action.payload),
        userBlogs: state.userBlogs.filter(blog => blog._id !== action.payload),
        loading: false,
        error: null
      };
    case BLOG_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        currentBlog: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filter: { category: '', author: '' }
      };
    default:
      return state;
  }
};

export default blogReducer;