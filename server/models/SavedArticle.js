// Articles saved in the "Mission Log" - one list per user
const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  createdAt: { type: Date, default: Date.now },
});

// a user can save the same article only once
savedSchema.index({ user: 1, article: 1 }, { unique: true });

module.exports = mongoose.model('SavedArticle', savedSchema);
