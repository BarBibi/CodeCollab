const mongoose = require('mongoose')

/**
 * Comment schema.
 * Stores comments authored by users and linked to a post.
 */
const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Comment', commentSchema)