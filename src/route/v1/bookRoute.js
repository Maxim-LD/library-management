import express from "express"
import { addBooks, getBookById, getBook, updateBook, deleteBook } from "../../controller/v1/bookController.js"

const v1Router = express.Router()

v1Router.post("/v1/books", addBooks)
v1Router.get("/v1/books", getBook)
v1Router.get("/v1/books/:id", getBookById)
v1Router.put("/v1/books/:id", updateBook)
v1Router.delete("/v1/books/:id", deleteBook)

export default v1Router