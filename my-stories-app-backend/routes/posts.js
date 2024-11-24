const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const validate = require('../middleware/validate');
const { postSchema } = require('../validation/schemas');
const sanitizeHtml = require('sanitize-html');

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

const sanitizeContent = (content) => {
  return sanitizeHtml(content, {
    allowedTags: [], 
    allowedAttributes: {}, 
  });
};

router.post('/create', authenticate, validate(postSchema), async (req, res) => {
  try {
    const { title, content } = req.body;
    const sanitizedContent = sanitizeContent(content);
    const post = new Post({ title, content: sanitizedContent, author: req.userId, status: 'pending' });
    await post.save();

    // Create notification for admin
    const adminUser = await User.findOne({ role: 'admin' });
    const notification = new Notification({
      userId: adminUser._id,
      type: 'postSubmitted',
      postId: post._id,
      message: `New post submitted by ${req.user.name}`,
    });
    await notification.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId }).populate('author', 'name');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/approved', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'approved' }).populate('author', 'name');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/pending', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const posts = await Post.find({ status: 'pending' }).populate('author', 'name');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/approve/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const post = await Post.findByIdAndUpdate(id, { status: 'approved' }, { new: true });

    // Create notification for user
    const notification = new Notification({
      userId: post.author,
      type: 'postApproved',
      postId: post._id,
      message: `Your post "${post.title}" has been approved.`,
    });
    await notification.save();

    res.json({ message: 'Post approved', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/disapprove/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const post = await Post.findByIdAndUpdate(id, { status: 'disapproved' }, { new: true });

    // Create notification for user
    const notification = new Notification({
      userId: post.author,
      type: 'postDisapproved',
      postId: post._id,
      message: `Your post "${post.title}" has been disapproved.`,
    });
    await notification.save();

    res.json({ message: 'Post disapproved', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.userId });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/edit/:id', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const sanitizedContent = sanitizeContent(content);
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { title, content: sanitizedContent },
      { new: true }
    );

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;