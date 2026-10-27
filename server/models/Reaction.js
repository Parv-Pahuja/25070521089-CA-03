// Reaction counts for one article (one document per article)
const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', unique: true },
  rocket: { type: Number, default: 0 },
  mindBlown: { type: Number, default: 0 },
  skeptical: { type: Number, default: 0 },
});

module.exports = mongoose.model('Reaction', reactionSchema);
