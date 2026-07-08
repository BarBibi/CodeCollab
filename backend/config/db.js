const mongoose = require('mongoose')

/**
 * Establishes a connection to the MongoDB database using the URI from the environment variables.
 * Logs a success message upon connection or an error message if the connection fails.
 * The process will exit with a non-zero status code if the connection cannot be established.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB