const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isBlacklisted } = require('../helperFunctions/tokenBlacklist');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login Expired! Login Again' });

  if (isBlacklisted(token)) {
    return res.status(401).json({ error: 'Token has been invalidated. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    req.user = user;
    req.token = token; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;