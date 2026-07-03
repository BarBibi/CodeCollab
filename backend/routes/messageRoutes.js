const express = require('express')
const { getMessages } = require('../controllers/messageController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/:userId').get(protect, getMessages)

module.exports = router