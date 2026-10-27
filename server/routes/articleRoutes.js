const express = require('express');
const router = express.Router();
const { getArticles, getArticleById, getTrending } = require('../controllers/articleController');

router.get('/', getArticles);
router.get('/trending', getTrending); // must be above '/:id'
router.get('/:id', getArticleById);

module.exports = router;
