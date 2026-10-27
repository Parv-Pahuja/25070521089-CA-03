// A registered user
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 40 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // stored as a bcrypt hash, never plain text
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
