import mongoose from 'mongoose'
import { asyncHandler } from '../middleware/errorHandler.js'

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Database connected")
    })
    .catch((err) => {
      console.log(`Database connection failed: ${err.message}`)
    })
}

export default connectDB