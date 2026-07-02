const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from the root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON payloads

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('CodeCollab API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});