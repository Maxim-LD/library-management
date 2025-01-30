# Maxim Library Management API

## Table of Contents
- [Introduction](#introduction)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Rate Limiting](#rate-limiting)
- [Testing](#testing)

## Introduction
Maxim Library Management API is a RESTful API for managing a library's book collection. It allows users to add, update, delete, and retrieve books.

## Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/LibraryManagement.git
    cd LibraryManagement
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    PORT=3000
    ```

4. Start the MongoDB server:
    Ensure that your MongoDB server is running. You can start it using the command:
    ```bash
    mongod
    ```

## Running the Application
To start the application, run:
```bash
npm start
```
The server will start on the port specified in the `.env` file (default is 3000).

## API Endpoints

### Add a Book
- **URL:** `/api/v1/books`
- **Method:** `POST`
- **Body:**
    ```json
    {
        "title": "Book Title",
        "author": "Author Name",
        "genre": "Genre",
        "publicationDate": "YYYY-MM-DD",
        "edition": "Edition",
        "summary": "Book Summary"
    }
    ```
- **Response:**
    ```json
    {
        "status": "success",
        "code": 201,
        "message": "Book added successfully",
        "data": {
            "id": "BOOK-uuid",
            "title": "Book Title",
            "author": "Author Name",
            "genre": "Genre",
            "publicationDate": "YYYY-MM-DD",
            "edition": "Edition",
            "summary": "Book Summary",
            "__v": 0
        }
    }
    ```

### Get a Book by ID
- **URL:** `/api/v1/books/:bookId`
- **Method:** `GET`
- **Response:**
    ```json
    {
        "status": "success",
        "code": 200,
        "message": "Book details retrieved successfully.",
        "data": {
            "id": "BOOK-uuid",
            "title": "Book Title",
            "author": "Author Name",
            "genre": "Genre",
            "publicationDate": "YYYY-MM-DD",
            "edition": "Edition",
            "summary": "Book Summary",
            "available": "available",
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD",
            "__v": 0
        },
         "headers": {
            "limit": "100",
            "remaining": "80",
            "reset": "96"
        }
    }
    ```

### Get All Books
- **URL:** `/api/v1/books`
- **Method:** `GET`
- **Response:**
    ```json
    {
        "status": "success",
        "code": 200,
        "message": "Books retrieved successfully.",
        "count": 4,
        "data": [
            {
                "id": "BOOK-uuid1",
                "title": "Book Title 1",
                "author": "Author Name 1",
                "genre": "Genre 1",
                "publicationDate": "YYYY-MM-DD",
                "edition": "Edition 1",
                "summary": "Book Summary 1",
                "available": "available",
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD",
                "__v": 0
            },
            {
                "id": "BOOK-uuid2",
                "title": "Book Title 2",
                "author": "Author Name 2",
                "genre": "Genre 2",
                "publicationDate": "YYYY-MM-DD",
                "edition": "Edition 2",
                "summary": "Book Summary 2",
                "available": "not available",
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD",
                "__v": 0
            }
        ],
        "pagination": {
            "pageNumber": 1,
            "pageSize": 5,
            "skip": 0
        },
        "headers": {
            "limit": "100",
            "remaining": "80",
            "reset": "96"
        }
    }
    ```

### Update a Book
- **URL:** `/api/v1/books/:bookId`
- **Method:** `PUT`
- **Body:**
    ```json
    {
        "title": "Updated Book Title",
        "author": "Updated Author Name",
        "genre": "Updated Genre",
        "publicationDate": "YYYY-MM-DD",
        "edition": "Updated Edition",
        "summary": "Updated Book Summary",
        "available": "available",

    }
    ```
- **Response:**
    ```json
    {
        "status": "success",
        "code": 200,
        "message": "Book updated successfully",
        "data": {
            "id": "BOOK-uuid",
            "title": "Updated Book Title",
            "author": "Updated Author Name",
            "genre": "Updated Genre",
            "publicationDate": "YYYY-MM-DD",
            "edition": "Updated Edition",
            "summary": "Updated Book Summary",
            "available": "available",
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD",
            "__v": 0
        }
    }
    ```

### Delete a Book
- **URL:** `/api/v1/books/:bookId`
- **Method:** `DELETE`
- **Response:**
    ```json
    {
        "status": "success",
        "code": 200,
        "message": "Book deleted successfully"
    }
    ```

## Rate Limiting
The API has rate limiting enabled to prevent abuse. The rate limiter is configured to allow a certain number of requests per minute. If the limit is exceeded, the API will respond with a `429 Too Many Requests` status.

### Rate Limiting Headers
- **X-RateLimit-Limit:** The maximum number of requests that the client is allowed to make in a given period.
- **X-RateLimit-Remaining:** The number of requests remaining in the current rate limit window.
- **X-RateLimit-Reset:** The time at which the current rate limit window resets.
## Pagination
The API supports pagination for endpoints that return multiple items. This helps to manage large sets of data by dividing them into pages.

### Pagination Parameters
- **page:** The page number to retrieve (default is 1).
- **limit:** The number of items per page (default is 10).

### Example Request
To retrieve the second page with 5 items per page:
```http
GET /api/v1/books?page=2&limit=5
```

### Example Response
```json
{
    "status": "success",
    "code": 200,
    "message": "Books retrieved successfully.",
    "count": 5,
    "data": [
        {
            "id": "BOOK-uuid6",
            "title": "Book Title 6",
            "author": "Author Name 6",
            "genre": "Genre 6",
            "publicationDate": "YYYY-MM-DD",
            "edition": "Edition 6",
            "summary": "Book Summary 6",
            "available": "available",
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD",
            "__v": 0
        },
        {
            "id": "BOOK-uuid7",
            "title": "Book Title 7",
            "author": "Author Name 7",
            "genre": "Genre 7",
            "publicationDate": "YYYY-MM-DD",
            "edition": "Edition 7",
            "summary": "Book Summary 7",
            "available": "not available",
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD",
            "__v": 0
        }
    ],
    "pagination": {
        "pageNumber": 2,
        "pageSize": 5,
        "skip": 5
    },
    "headers": {
        "limit": "100",
        "remaining": "80",
        "reset": "96"
    }
}
```

## Testing
To run the tests, use the following command:
```bash
npm test
```
The tests are written using Mocha, Chai, and Sinon for unit testing and Supertest for API testing.

## Conclusion
This documentation provides an overview of how to set up, run, and interact with the Maxim Library Management API. For more detailed information, please refer to the source code and comments within the project.