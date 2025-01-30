import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },//generated on creation
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => !isNaN(Date.parse(value)),
        message: "Invalid date format! Use format (YYYY-MM-DD).",
      },
    },
    edition: { type: String, default: "First Edition" },
    summary: { type: String, required: false },
    available: { type: String, default: "available" },
  },
  {
    timestamps: true,
  }
)

const books = mongoose.model('books', bookSchema)

export default books