import rateLimit from 'express-rate-limit'


const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(429).json({
            status: "error",
            code: 429,
            message: "Too many requests, please try again later",
            limit: options.limit,
            remaining: res.getHeaders()['ratelimit-remaining'],
            reset: new Date(Date.now() + options.windowMs).toISOString()
        })
    }
})

export default rateLimiter