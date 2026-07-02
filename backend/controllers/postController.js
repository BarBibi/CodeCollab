const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get all posts
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
    try {
        const query = req.query.tag ? { tags: req.query.tag } : {};
        const posts = await Post.find(query)
            .populate('userId', 'username profilePic') // Ensure username is returned
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const post = await Post.create({
            userId: req.user._id,
            title,
            content,
            tags,
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Authorization check
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();
        // Also delete associated comments
        await Comment.deleteMany({ postId: req.params.id });

        res.status(200).json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Like / Unlike a post
// @route   PUT /api/posts/:id/like
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike
            post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
        } else {
            // Like
            post.likes.push(req.user._id);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.create({
            postId: req.params.id,
            userId: req.user._id,
            content,
        });
        
        const populatedComment = await comment.populate('userId', 'username');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id })
            .populate('userId', 'username')
            .sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};