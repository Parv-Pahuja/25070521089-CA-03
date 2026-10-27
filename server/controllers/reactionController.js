const Reaction = require('../models/Reaction');

const allowed = ['rocket', 'mindBlown', 'skeptical'];

// GET /api/reactions/:articleId
exports.getReactions = async (req, res) => {
  try {
    const r = await Reaction.findOne({ article: req.params.articleId });
    // If nobody reacted yet, send zeros
    res.json({
      rocket: r ? r.rocket : 0,
      mindBlown: r ? r.mindBlown : 0,
      skeptical: r ? r.skeptical : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reactions/:articleId  body: { type: 'rocket' }
exports.addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    if (!allowed.includes(type)) return res.status(400).json({ message: 'Invalid reaction' });

    // $inc adds 1 to the chosen counter. upsert creates the document if needed.
    const r = await Reaction.findOneAndUpdate(
      { article: req.params.articleId },
      { $inc: { [type]: 1 } },
      { upsert: true, new: true }
    );
    res.json({ rocket: r.rocket, mindBlown: r.mindBlown, skeptical: r.skeptical });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
