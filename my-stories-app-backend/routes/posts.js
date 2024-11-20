const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { postSchema } = require('../validation/schemas');

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

router.post('/create', authenticate, validate(postSchema), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.userId });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'approved' }).populate('author', 'name');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.isAdmin) return res.status(403).json({ error: 'Access denied' });
    const posts = await Post.find({ status: 'pending' }).populate('author', 'name');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/approve/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.isAdmin) return res.status(403).json({ error: 'Access denied' });
    const post = await Post.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json({ message: 'Post approved', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/disapprove/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.isAdmin) return res.status(403).json({ error: 'Access denied' });
    const post = await Post.findByIdAndUpdate(req.params.id, { status: 'disapproved' }, { new: true });
    res.json({ message: 'Post disapproved', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;