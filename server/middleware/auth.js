// Checks the JWT token sent in the "Authorization: Bearer <token>" header
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Blocks the request if the user is not logged in
exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Please log in first' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session expired, please log in again' });
  }
};
