const express = require('express');
const router = express.Router();
const { getReactions, addReaction } = require('../controllers/reactionController');
const { protect } = require('../middleware/auth');

router.get('/:articleId', getReactions);        // anyone can read
router.post('/:articleId', protect, addReaction); // login needed to react

module.exports = router;
