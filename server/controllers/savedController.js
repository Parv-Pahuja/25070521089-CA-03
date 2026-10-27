const SavedArticle = require('../models/SavedArticle');

// GET /api/saved -> saved articles of the logged-in user
exports.getSaved = async (req, res) => {
  try {
    const saved = await SavedArticle.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('article');
    const articles = saved.map((s) => s.article).filter((a) => a); // remove empty ones
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/saved/:articleId -> save an article
exports.saveArticle = async (req, res) => {
  try {
    await SavedArticle.updateOne(
      { user: req.user._id, article: req.params.articleId },
      { $set: { user: req.user._id, article: req.params.articleId } },
      { upsert: true }
    );
    res.status(201).json({ message: 'Saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/saved/:articleId -> remove from Mission Log
exports.unsaveArticle = async (req, res) => {
  try {
    await SavedArticle.deleteOne({ user: req.user._id, article: req.params.articleId });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
