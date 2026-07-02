const express = require('express');
const {
    getPosts,
    createPost,
    deletePost,
    likePost,
    addComment,
    getComments
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .delete(protect, deletePost);

router.route('/:id/like')
    .put(protect, likePost);

router.route('/:id/comments')
    .get(getComments)
    .post(protect, addComment);

module.exports = router;