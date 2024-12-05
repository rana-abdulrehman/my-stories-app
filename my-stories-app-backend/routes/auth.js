const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { addToBlacklist } = require('../helperFunctions/tokenBlacklist');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validation/schemas');
const { sendResetEmail } = require('../helperFunctions/mailService');

const router = express.Router();

router.post('/signup', validate(signupSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const user = new User({ name, email, password }); 
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' }); 
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const expiryTime = Date.now() + 3600000; 

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(expiryTime);
    await user.save();

    sendResetEmail(email, resetToken).catch(console.error);

    res.json({ message: 'Reset token generated and sent to your email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const user = await User.findOne({ resetToken: token });
    if (!user || user.resetTokenExpiry < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (user.password === newPassword) {
      return res.status(400).json({ error: 'New password cannot be the same as the current password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', authenticate, (req, res) => {
  const token = req.token;
  addToBlacklist(token);
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;