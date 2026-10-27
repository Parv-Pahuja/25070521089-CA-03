// A comment (or a reply) on an article
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  // If parent is null it is a normal comment. If it has a value, it is a reply to that comment.
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
