const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500
  const message = err.message || "Internal Server Error"


  let customMessage

  if (err.name === "ValidationError") {
    customMessage = "Invalid input data. Please check your request."
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    customMessage = "Duplicate field value entered."
  } else if (err.message.includes("Database error")) {
    customMessage = "An issue occurred while interacting with the database."
  } else {
    customMessage = err.message || "An unexpected error occurred."
  }
  
  // Log the error for debugging purposes
  console.error(
    JSON.stringify({
        Message: message,
        Status: statusCode,
        Time: new Date().toISOString(),
      },
      null,
      2
    )
  )

  // Sent to the client
  res.status(statusCode).json({
    status: failed,
    message,
  })
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

export { errorHandler, asyncHandler }
