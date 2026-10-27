const express = require('express');
const router = express.Router();
const { getSaved, saveArticle, unsaveArticle } = require('../controllers/savedController');
const { protect } = require('../middleware/auth');

router.use(protect); // Mission Log needs login

router.get('/', getSaved);
router.post('/:articleId', saveArticle);
router.delete('/:articleId', unsaveArticle);

module.exports = router;
