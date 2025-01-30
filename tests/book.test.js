import request from "supertest"
import { expect } from "chai"
import sinon from "sinon"
import app from "../src/app.js"
import bookSchema from "../src/model/booksSchema.js"

describe("POST /api/v1/books", function () {
    beforeEach(() => {
        // Stub the Mongoose `save` function to prevent actual database writes
        sinon.stub(bookSchema.prototype, "save").resolves({
            id: "BOOK-12345",
            title: "Test Book",
            author: "John Doe",
            genre: "Fiction",
            publicationDate: "2024-01-01",
            edition: "1st",
            summary: "This is a test book.",
        })

        // Stub the `findOne` method to simulate book existence check
        sinon.stub(bookSchema, "findOne").resolves(null)
    })
    afterEach(() => {
        sinon.restore() // Restore original methods after each test
    })

    it("should add a new book and return success", async function () {
        const savedBook = {
            title: "Test Book",
            author: "Test Author",
            genre: "Test Genre",
            publicationDate: "Test Date",
            edition: "Test Edition",
            summary: "This is a test book.",
        }
        const res = await request(app)
            .post("/api/v1/books")
            .send(savedBook)
        expect(res.status).to.equal(201)
        expect(res.body).to.have.property("status", "success")
        expect(res.body).to.have.property("message", "Book added successfully")
    })

    it("should return an error if required fields are missing", async function () {
        const incompleteBook = {}

        const res = await request(app)
            .post("/api/v1/books")
            .send(incompleteBook)
        expect(res.status).to.equal(400)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "All fields are required")
    })

    it("should return an error if book already exists", async function () {
        bookSchema.findOne.resolves({ title: "Existing Book" })
        const existingBook = {
            title: "Existing Book",
            author: "Existing Author",
            genre: "Existing Genre",
            publicationDate: "Existing Date",
            edition: "Existing Edition",
            summary: "This is an existing book summary",
        }
        const res = await request(app).post("/api/v1/books").send(existingBook)
        expect(res.status).to.equal(400)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "Book already exist")
    })

    it("should return an error if an error occurs while saving the book", async function () {
        bookSchema.prototype.save.rejects(new Error("Database save error"))
        const savedBook = {
            title: "Test Book",
            author: "Test Author",
            genre: "Test Genre",
            publicationDate: "Test Date",
            edition: "Test Edition",
            summary: "This is a test book.",
        }
        const res = await request(app).post("/api/v1/books").send(savedBook)
        expect(res.status).to.equal(500)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "An error occurred while saving the book")
        expect(res.body.error).to.have.property("details", "Database save error")
    })
})

describe("GET /api/v1/books", function () {
    beforeEach(() => {
        // Stub the Mongoose `find` method to simulate fetching books
        sinon.stub(bookSchema, "find").resolves([
            {
                id: "BOOK-12345",
                title: "Test Book 1",
                author: "Author 1",
                genre: "Genre 1",
                publicationDate: "2024-01-01",
                edition: "1st",
                summary: "Summary 1",
            },
            {
                id: "BOOK-67890",
                title: "Test Book 2",
                author: "Author 2",
                genre: "Genre 2",
                publicationDate: "2025-01-01",
                edition: "2nd",
                summary: "Summary 2",
            }
        ])
    })

    afterEach(() => {
        sinon.restore() // Restore original methods after each test
    })

    it("should return a list of books", async function () {
        const res = await request(app).get("/api/v1/books")
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property("status", "success")
        expect(res.body).to.have.property("message", "Books retrieved successfully.")
        expect(res.body).to.have.property("data").that.is.an("array").with.lengthOf(2)
    })

    it("should return an empty list if no books are found", async function () {
        bookSchema.find.resolves([])
        const res = await request(app).get("/api/v1/books")
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property("status", "success")
        expect(res.body).to.have.property("message", "Books retrieved successfully.")
        expect(res.body).to.have.property("data").that.is.an("array").with.lengthOf(0)
    })

    it("should return an error if an error occurs while fetching books", async function () {
        bookSchema.find.rejects(new Error("Database fetch error"))
        const res = await request(app).get("/api/v1/books")
        expect(res.status).to.equal(500)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "An error occurred while fetching books")
        expect(res.body.error).to.have.property("details", "Database fetch error")
    })
})

describe("GET /api/v1/books/:id", function () {
    beforeEach(() => {
        sinon.stub(bookSchema, "findOne")
    })
    afterEach(() => {
        sinon.restore()
    })

    it("should return a book when a valid ID is provided", async function () {
        const bookId = "BOOK-12345"
        const savedBook = {
            id: "BOOK-12345",
            title: "Test Book",
            author: "Test Author",
            genre: "Test Genre",
            publicationDate: "Test Date",
            edition: "Test Edition",
            summary: "This is a test book.",
        }
        bookSchema.findOne.resolves(savedBook)
        const res = await request(app).get(`/api/v1/books/${bookId}`)
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property("status", "success")
        expect(res.body).to.have.property("message", "Book details retrieved successfully.")
        expect(res.body).to.have.property("data").that.includes(savedBook)
    })

    it("should return an error when no book is found", async function () {
        const bookId = "BOOK-99999"
        bookSchema.findOne.resolves(null)
        const res = await request(app).get(`/api/v1/books/${bookId}`)
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "Book not found")
    })
})

describe("PUT /api/v1/books/:id", function () {
    beforeEach(() => {
        // Stub the Mongoose `findOneAndUpdate` method to simulate updating a book
        sinon.stub(bookSchema, "findOneAndUpdate").resolves({
            id: "BOOK-12345",
            title: "Updated Test Book",
            author: "Updated Author",
            genre: "Updated Genre",
            publicationDate: "2024-01-01",
            edition: "1st",
            summary: "This is an updated test book.",
        })

        // Stub the `findOne` method to simulate book existence check
        sinon.stub(bookSchema, "findOne").resolves({
            id: "BOOK-12345",
            title: "Test Book",
            author: "Test Author",
            genre: "Test Genre",
            publicationDate: "2024-01-01",
            edition: "1st",
            summary: "This is a test book.",
        })
    })

    afterEach(() => {
        sinon.restore() // Restore original methods after each test
    })

    it("should update a book and return success", async function () {
        const updatedBook = {
            title: "Updated Test Book",
            author: "Updated Author",
            genre: "Updated Genre",
            publicationDate: "2024-01-01",
            edition: "1st",
            summary: "This is an updated test book.",
        }
        const res = await request(app)
            .put("/api/v1/books/BOOK-12345")
            .send(updatedBook)
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property("status", "success")
        expect(res.body).to.have.property("message", "Book updated successfully")
        expect(res.body.data).to.include(updatedBook)
    })

    it("should return an error if book ID is not provided", async function () {
        const updatedBook = {
            title: "Updated Test Book",
            author: "Updated Author",
            genre: "Updated Genre",
            publicationDate: "2024-01-01",
            edition: "1st",
            summary: "This is an updated test book.",
        }
        const res = await request(app)
            .put("/api/v1/books/")
            .send(updatedBook)
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "Please provide a book ID")
    })

    it("should return an error if book is not found", async function () {
        bookSchema.findOne.resolves(null)
        const updatedBook = {
            title: "Updated Test Book",
            author: "Updated Author",
            genre: "Updated Genre",
            publicationDate: "2024-01-01",
            edition: "1st",
            summary: "This is an updated test book.",
        }
        const res = await request(app)
            .put("/api/v1/books/BOOK-99999")
            .send(updatedBook)
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "Book not found")
    })
})

describe("DELETE /api/v1/books/:id", function () {
    beforeEach(() => {
        // Stub the Mongoose `findOneAndDelete` method to simulate deleting a book
        sinon.stub(bookSchema, "findOneAndDelete").resolves({
            id: "BOOK-12345",
            title: "Test Book",
            author: "Test Author",
            genre: "Test Genre",
            publicationDate: "2024-01-01",
            edition: "1st",
            summary: "This is a test book.",
        })
    })

    afterEach(() => {
        sinon.restore() // Restore original methods after each test
    })

    it("should delete a book and return success", async function () {
        const res = await request(app).delete("/api/v1/books/BOOK-12345")
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property("status", "success")
        expect(res.body).to.have.property("message", "Book deleted successfully")
    })

    it("should return an error if book ID is not provided", async function () {
        const res = await request(app).delete("/api/v1/books/")
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "Please provide a book ID")
    })

    it("should return an error if book is not found", async function () {
        bookSchema.findOneAndDelete.resolves(null)
        const res = await request(app).delete("/api/v1/books/BOOK-99999")
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property("status", "error")
        expect(res.body).to.have.property("message", "Book not found")
    })
})