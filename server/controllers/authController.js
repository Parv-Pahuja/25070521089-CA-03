const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Creates a token that the browser sends back with every request
const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Only send safe fields to the browser (never the password)
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/signup  body: { name, email, password }
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !name.trim() || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Enter a valid email' });
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim().slice(0, 40),
      email,
      password: hashed,
    });
    res.status(201).json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login  body: { email, password }
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ message: 'Wrong email or password' });

    res.json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me  (needs token) -> the current user
exports.me = (req, res) => res.json({ user: publicUser(req.user) });
