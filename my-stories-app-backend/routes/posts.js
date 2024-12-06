const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { postSchema } = require('../validation/schemas');
const sanitizeHtml = require('sanitize-html');

const router = express.Router();

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
    const post = new Post({ title, content: sanitizedContent, author: req.user._id, status: 'pending' });
    await post.save();

    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      const notification = new Notification({
        userId: adminUser._id,
        type: 'postSubmitted',
        postId: post._id,
        message: `New post submitted by ${req.user.name}`,
      });
      await notification.save();
    } else {
      console.warn('No admin user found to notify');
    }

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).populate('author', 'name').sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/approved', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'approved' }).populate('author', 'name').sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/pending', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
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
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const post = await Post.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    const posts = await Post.find({ status: 'pending' }).populate('author', 'name');

    const notification = new Notification({
      userId: post.author,
      type: 'postApproved',
      postId: post._id,
      message: `Your post "${post.title}" has been approved.`,
    });
    await notification.save();

    res.json({ message: 'Post approved', posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/disapprove/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const post = await Post.findByIdAndUpdate(id, { status: 'disapproved' }, { new: true });
    const posts = await Post.find({ status: 'pending' }).populate('author', 'name');

    const notification = new Notification({
      userId: post.author,
      type: 'postDisapproved',
      postId: post._id,
      message: `Your post "${post.title}" has been disapproved.`,
    });
    await notification.save();

    res.json({ message: 'Post disapproved', posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    const posts = await Post.find({ author: req.user._id }).populate('author', 'name').sort('-createdAt');
    res.json({ message: 'Post deleted successfully', posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/edit/:id', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const sanitizedContent = sanitizeContent(content);
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { title, content: sanitizedContent },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found or you do not have permission to edit this post' });
    }

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