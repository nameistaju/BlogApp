// routes/blogs.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Blog = require('../models/Blog');
const User = require('../models/User');

// @route   GET /api/blogs
// @desc    Get all blogs (with optional filters)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, author } = req.query;
    let query = {};
    
    // Apply filters if provided
    if (category) query.category = category;
    if (author) query.author = author;
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blogs/:id
// @desc    Get blog by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      
      const newBlog = new Blog({
        title: req.body.title,
        category: req.body.category,
        content: req.body.content,
        image: req.body.image,
        author: user.name,
        userId: req.user.id
      });

      const blog = await newBlog.save();
      res.json(blog);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    
    // Check if user authorized
    if (blog.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update fields
    if (req.body.title) blog.title = req.body.title;
    if (req.body.category) blog.category = req.body.category;
    if (req.body.content) blog.content = req.body.content;
    if (req.body.image) blog.image = req.body.image;
    blog.updatedAt = Date.now();
    
    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    
    // Check if user authorized
    if (blog.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await blog.deleteOne();
    res.json({ msg: 'Blog removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blogs/user/me
// @desc    Get current user's blogs
// @access  Private
router.get('/user/me', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;