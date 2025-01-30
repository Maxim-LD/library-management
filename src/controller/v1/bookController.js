import { asyncHandler } from "../../middleware/errorHandler.js"
import bookSchema from "../../model/booksSchema.js"
import { v4 as uuidv4 } from 'uuid'
import pagination from "../../utils/pagination.js"

const addBooks = asyncHandler(async (req, res) => {
    const { title, author, genre, publicationDate, edition, summary } = req.body
    if (!title || !author || !genre || !publicationDate || !edition || !summary) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "All fields are required" 
        })
    }
    //Check if book already exist
    const isExist = await bookSchema.findOne({ title })
    if (isExist) { 
        return res.status(400).json({ 
            status: "error",
            code: 400,
            message: "Book already exist" 
        })
    }
    //generate unique id for the new book
    const id = `BOOK-${uuidv4()}`
    const bookData = { id, title, author, genre, publicationDate, edition, summary }
    const newBook = new bookSchema(bookData) //a new book instance with the provided book object

     try {
        const savedBook = await newBook.save(); // Await the save operation        
        return res.status(201).json({
            status: "success",
            code: 201,
            message: "Book added successfully",
            data: savedBook,
        });
    } catch (err) {
        console.error( "Error saving book:", err.message ) // For debugging
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "An error occurred while saving the book",
            error: {
                details: err.message,
            },
        });
    }
})

const getBook = asyncHandler( async(req, res) => {
    const { title, author, genre, publicationDate, startDate, endDate } = req.query
    const { pageNumber, pageSize, skip } = pagination(req)

    if (!title && !author && !genre && !publicationDate && !startDate && !endDate) {
            return res.status(400).json({
                status: "error",
                code: 400,
                message: "Please provide at least one search query",
                // errors: {
                //     details: err.message
                // }
            })
    }
    const search = {}
        if (title) search.title = { $regex: String(title), $options: "i" }
        if (author) search.author = { $regex: String(author), $options: "i" }
        if (genre) search.genre = { $regex: String(genre), $options: "i" }    
        if (publicationDate) { 
            search.publicationDate = new Date(publicationDate)
        }
        if (startDate || endDate) {
            search.publicationDate = {}
        if (startDate) search.publicationDate.$gte = new Date(startDate)
        if (endDate) search.publicationDate.$lte = new Date(endDate)
    }
    const books = await bookSchema
      .find(search)
      .sort({ title: 1 })
      .skip(skip)
      .limit(pageSize)
    const totalBooks = await bookSchema.countDocuments(search)
    if (books.length === 0) {
        return res.status(404).json({
            status: "error",
            code: 404,
            message: "No books found"
        })
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Books retrieved successfully.",
      count: totalBooks,
      data: books,
      pagination: { pageNumber, pageSize, skip },
      headers: {
        limit: res.getHeaders()["ratelimit-limit"],
        remaining: res.getHeaders()["ratelimit-remaining"],
        reset: res.getHeaders()["ratelimit-reset"],
      },
    })
})

const getBookById = asyncHandler(async (req, res) => {
  const id = req.params.id
    const book = await bookSchema.findOne({ id })
        if (!book) {
            return res.status(404).json({
                status: "error",
                code: 404,
                message: "Book not found",
            })
        }
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Book details retrieved successfully.",
            data: book,
            headers: {
                limit: res.getHeaders()["ratelimit-limit"],
                remaining: res.getHeaders()["ratelimit-remaining"],
                reset: res.getHeaders()["ratelimit-reset"],
            }
        })
})

const updateBook = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { title, author, genre, publicationDate, edition, summary, available, } = req.body
    if (!id) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "Please provide a book ID"
        })
    }
    const updatedBook = {
       $set: {
        ...(title && { title }),
        ...(author && { author }),
        ...(genre && { genre }),
        ...(publicationDate && { publicationDate }),
        ...(edition && { edition }),
        ...(summary && { summary }),
        ...(available !== undefined && { available })
       }
    }
    const updated = await bookSchema.findOneAndUpdate({ id }, updatedBook, { new: true, runValidators: true })
    if (!updated) { //for any error that might occur while updating the book
        return res.status(400).json({
          status: "error",
          code: 404,
          message: "Book not found",
        })
    } return res.status(200).json({
      status: "success",
      code: 200,
      message: "Book updated successfully",
      data: updated,
    })
})

const deleteBook = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "Please provide a book ID"
        })
    }
    const deleted = await bookSchema.findOneAndDelete({ id })
    if (!deleted) {
        return res.status(400).json({
            status: "error",
            code: 404,
            message: "Book not found"
        })
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Book deleted successfully",
    })
})

export {
    addBooks,
    getBook,
    getBookById,
    updateBook,
    deleteBook
}