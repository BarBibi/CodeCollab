/**
 * Backend application entry point.
 *
 * Responsibilities:
 * - Load environment configuration.
 * - Connect to MongoDB.
 * - Register HTTP middleware and API routes.
 * - Initialize Socket.IO for real-time chat events.
 */
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const connectDB = require('./config/db')

// Load environment variables from .env file
require('dotenv').config()

// Connect to MongoDB
connectDB()

const app = express()
const server = http.createServer(app) // Wrap Express app with HTTP server

// Socket.io initialization
const io = new Server(server, {
    cors: {
        origin: "*", // Will be restricted to the React app's URL later
        methods: ["GET", "POST"]
    }
})

// Middlewares
app.use(cors())
app.use(express.json()) // Parse JSON payloads

// Routes imports
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const messageRoutes = require('./routes/messageRoutes')
const userRoutes = require('./routes/userRoutes')

// Use Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

// Socket.IO event handlers for joining rooms and exchanging messages.
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Join a private room (room ID should be a consistent string, e.g., combining both user IDs)
    socket.on('join_chat', (room) => {
        socket.join(room)
        console.log(`User joined room: ${room}`)
    })

    // Persist and broadcast new messages to all members of the chat room.
    socket.on('send_message', async (data) => {
        const { senderId, receiverId, content, room } = data

        try {
            const Message = require('./models/Message')
            
            // Persist message to MongoDB
            const newMessage = await Message.create({
                senderId,
                receiverId,
                content
            })

            // Broadcast the saved message to everyone in the room (including the sender)
            io.to(room).emit('receive_message', newMessage)
        } catch (error) {
            console.error('Error saving message to DB:', error)
        }
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
    })
})

const PORT = process.env.PORT || 5000

// IMPORTANT: Use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})