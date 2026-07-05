const User = require('../models/User')

exports.searchUsers = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { username: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } }
                ]
            }
            : {}

        // Find users matching the keyword, excluding the logged-in user
        const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
            .select('-password')
            .limit(10)

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}