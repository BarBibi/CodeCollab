/**
 * Authentication controller.
 * Handles user registration and login flows.
 */
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * Generate a signed JWT for an authenticated user.
 * @param {string|import('mongoose').Types.ObjectId} userId - MongoDB user identifier.
 * @returns {string} Signed JWT token.
 */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

/**
 * Register a new user account.
 * @route POST /api/auth/signup
 */
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const userExists = await User.findOne({ $or: [{ email }, { username }] })
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

/**
 * Authenticate an existing user and return profile + token.
 * @route POST /api/auth/signin
 */
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}