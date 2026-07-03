const Message = require('../models/Message')

// @desc    Get chat history between current user and another user
// @route   GET /api/messages/:userId
exports.getMessages = async (req, res) => {
    try {
        const { userId: otherUserId } = req.params
        const currentUserId = req.user._id

        // Find messages where the current user is either the sender or the receiver
        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 }) // Sort chronologically

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}