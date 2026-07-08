/**
 * Post controller.
 * Manages posts, likes, and post comments.
 */
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')

/**
 * Get all posts with optional filters: tag, date, and username.
 * @route GET /api/posts
 */
exports.getPosts = async (req, res) => {
    try {
        let query = {}
        if (req.query.tag) {
            query.tags = req.query.tag
        }
        if (req.query.date) {
            const date = new Date(req.query.date)
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)
            query.createdAt = {
                $gte: date,
                $lt: nextDay
            }
        }
        if (req.query.username) {
            const user = await User.findOne({ username: req.query.username })
            if (user) {
                query.userId = user._id
            } else {
                return res.status(200).json([])
            }
        }

        const posts = await Post.find(query)
            .populate('userId', 'username profilePic') // Ensure username is returned
            .sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

/**
 * Create a new post for the authenticated user.
 * @route POST /api/posts
 */
exports.createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body
        const post = await Post.create({
            userId: req.user._id,
            title,
            content,
            tags,
        })
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

/**
 * Update an existing post owned by the authenticated user.
 * @route PUT /api/posts/:id
 */
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // Authorization check
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this post' })
        }

        const { title, content, tags } = req.body
        post.title = title || post.title
        post.content = content || post.content
        post.tags = tags || post.tags

        const updatedPost = await post.save()
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}


/**
 * Delete a post owned by the authenticated user.
 * Also deletes all comments associated with that post.
 * @route DELETE /api/posts/:id
 */
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // Authorization check
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this post' })
        }

        await post.deleteOne()
        // Also delete associated comments
        await Comment.deleteMany({ postId: req.params.id })

        res.status(200).json({ message: 'Post removed' })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

/**
 * Toggle like status for the authenticated user on a post.
 * @route PUT /api/posts/:id/like
 */
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const isLiked = post.likes.includes(req.user._id)

        if (isLiked) {
            // Unlike
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString())
        } else {
            // Like
            post.likes.push(req.user._id)
        }

        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

/**
 * Add a new comment to a post.
 * @route POST /api/posts/:id/comments
 */
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body
        const comment = await Comment.create({
            postId: req.params.id,
            userId: req.user._id,
            content,
        })
        
        const populatedComment = await comment.populate('userId', 'username')
        res.status(201).json(populatedComment)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

/**
 * Get all comments for a post in chronological order.
 * @route GET /api/posts/:id/comments
 */
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id })
            .populate('userId', 'username')
            .sort({ createdAt: 1 })
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}