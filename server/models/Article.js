// How a news article is stored in MongoDB
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  apiId: { type: Number, unique: true }, // id from Spaceflight News API (stops duplicates)
  title: String,
  summary: String,
  imageUrl: String,
  newsSite: String,
  url: String,            // link to the original article
  publishedAt: Date,
  category: String,       // Mars, Launches, ISS...
});

module.exports = mongoose.model('Article', articleSchema);
