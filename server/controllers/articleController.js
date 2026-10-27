const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const SavedArticle = require('../models/SavedArticle');
const { fetchLatestArticles } = require('../services/spaceflightApiService');

// Decide the category by looking for words in the title
function detectCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('mars')) return 'Mars';
  if (/\biss\b/.test(t) || t.includes('space station')) return 'ISS';
  if (t.includes('moon') || t.includes('lunar') || t.includes('artemis')) return 'Moon';
  if (t.includes('launch') || t.includes('rocket') || t.includes('falcon') || t.includes('starship')) return 'Launches';
  if (t.includes('satellite') || t.includes('starlink')) return 'Satellites';
  if (['telescope', 'galaxy', 'planet', 'asteroid', 'comet', 'black hole', 'discover'].some((w) => t.includes(w))) return 'Discovery';
  return 'General';
}

// Get new articles from the API and save them in MongoDB
let lastSync = 0; // remember when we last called the API
async function syncArticles() {
  const list = await fetchLatestArticles(30);
  for (const a of list) {
    // upsert = update if it exists, otherwise create it
    await Article.updateOne(
      { apiId: a.id },
      {
        $set: {
          title: a.title,
          summary: a.summary,
          imageUrl: a.image_url,
          newsSite: a.news_site,
          url: a.url,
          publishedAt: a.published_at,
          category: detectCategory(a.title),
        },
      },
      { upsert: true }
    );
  }
  lastSync = Date.now();
}

// GET /api/articles?category=Mars
exports.getArticles = async (req, res) => {
  try {
    // Only call the outside API if it was more than 60 seconds ago
    if (Date.now() - lastSync > 60 * 1000) {
      try {
        await syncArticles();
      } catch (err) {
        console.log('Sync failed (showing saved articles):', err.message);
      }
    }
    const filter = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const articles = await Article.find(filter).sort({ publishedAt: -1 }).limit(60);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/articles/:id
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(404).json({ message: 'Article not found' });
  }
};

// GET /api/articles/trending
// score = number of comments + reactions + saves
exports.getTrending = async (req, res) => {
  try {
    const articles = await Article.find();

    // Count comments per article
    const commentCounts = await Comment.aggregate([
      { $group: { _id: '$article', count: { $sum: 1 } } },
    ]);
    const commentMap = {};
    commentCounts.forEach((c) => (commentMap[c._id] = c.count));

    // Add up reactions per article
    const reactions = await Reaction.find();
    const reactionMap = {};
    reactions.forEach((r) => (reactionMap[r.article] = r.rocket + r.mindBlown + r.skeptical));

    // Count saves per article
    const saved = await SavedArticle.find();
    const savedMap = {};
    saved.forEach((s) => (savedMap[s.article] = 1));

    const scored = articles.map((a) => {
      const comments = commentMap[a._id] || 0;
      const reactionCount = reactionMap[a._id] || 0;
      const saves = savedMap[a._id] || 0;
      return { ...a.toObject(), comments, reactionCount, saves, score: comments + reactionCount + saves };
    });

    const top = scored
      .filter((a) => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(top);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
