const express = require('express')
const { getMessages, getConversations } = require('../controllers/messageController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/conversations').get(protect, getConversations)
router.route('/:userId').get(protect, getMessages)

module.exports = router