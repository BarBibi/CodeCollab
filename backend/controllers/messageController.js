const Message = require('../models/Message')
const User = require('../models/User')

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

// @desc    Get all conversations for the current user
// @route   GET /api/messages/conversations
exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id

        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$senderId', currentUserId] },
                            then: '$receiverId',
                            else: '$senderId'
                        }
                    },
                    lastMessage: { $last: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: '$userDetails._id',
                    username: '$userDetails.username',
                    lastMessage: '$lastMessage.content',
                    date: '$lastMessage.createdAt'
                }
            },
            {
                $sort: { date: -1 }
            }
        ])

        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}