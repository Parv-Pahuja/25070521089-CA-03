const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.get('/:articleId', getComments);   // anyone can read
router.post('/', protect, addComment);    // login needed to write

module.exports = router;
