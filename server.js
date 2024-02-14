import express from 'express'
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import expressFileUploader from 'express-fileupload'
import allRoutes from './routes/index.js'
import {
  urlNotFoundError,
  globalError,
} from './middlewares/error.middleware.js'

// Uncaught Exception Handler
process.on('uncaughtException', (error) => {
  console.log({ name: error.name, message: error.message })
  console.log('Uncaught exception occurred! shutting down...')
  process.exit(1)
})

// App Init
const app = express()
const port = process.env.PORT

// Rate Limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per `window` (here, per minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) =>
    res.status(options.statusCode).json({
      message: options.message,
    }),
})

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(helmet())
app.use(limiter)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// File Upload/Serve Middleware
app.use(
  expressFileUploader({
    createParentPath: true,
  })
)
app.use(
  '/uploads',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Expose-Headers', 'Content-Disposition')
    res.header('Cross-Origin-Resource-Policy', 'cross-origin')

    next()
  },
  express.static('uploads')
)

// All Routes
app.use('/api', allRoutes)

// Error Handlers
app.use(globalError)
app.all('*', urlNotFoundError)

// Server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Unhandled Rejection Handler
process.on('unhandledRejection', (error) => {
  console.log({ name: error.name, message: error.message })
  console.log('Unhandled rejection occurred! shutting down...')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
})
