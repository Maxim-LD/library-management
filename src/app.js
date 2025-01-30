import express from 'express'
import v1Router from './route/v1/bookRoute.js'
import rateLimiter from './utils/rateLimiter.js'

const app = express()

app.use(express.json())

app.use("/api", rateLimiter, v1Router)

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to Maxim Library Management API" })
})

app.use((req, res) => {
    res.status(404).json({ message: "This endpoint does not exist!" })
})

export default app