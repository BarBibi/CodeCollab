/**
 * Post routes.
 * Exposes feed, post management, likes, and comments endpoints.
 */
const express = require('express')
const {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    getComments
} = require('../controllers/postController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/')
    .get(getPosts)
    .post(protect, createPost)

router.route('/:id')
    .put(protect, updatePost)
    .delete(protect, deletePost)

router.route('/:id/like')
    .put(protect, likePost)

router.route('/:id/comments')
    .get(getComments)
    .post(protect, addComment)

module.exports = router