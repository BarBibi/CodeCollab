/**
 * Authentication middleware.
 * Validates Bearer tokens and attaches the current user to req.user.
 */
const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Protect routes by requiring a valid JWT in the Authorization header.
 * Expected header format: Bearer <token>
 */
const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token, exclude password
            req.user = await User.findById(decoded.id).select('-password')
            
            next()
        } catch (error) {
            console.error(error)
            res.status(401).json({ message: 'Not authorized, token failed' })
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' })
    }
}

module.exports = { protect }