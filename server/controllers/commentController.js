const Comment = require('../models/Comment');

// GET /api/comments/:articleId  -> all comments + replies of an article
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/comments  body: { articleId, parentId (optional), text }  (name comes from the logged-in user)
exports.addComment = async (req, res) => {
  try {
    const { articleId, parentId, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment is required' });
    }
    const comment = await Comment.create({
      article: articleId,
      parent: parentId || null, // null = normal comment, otherwise a reply
      user: req.user._id,
      name: req.user.name,
      text: text.trim().slice(0, 500),
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
