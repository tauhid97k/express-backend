import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  register,
  login,
  resetPassword,
  verifyResetCode,
  updatePassword,
  refreshAuthToken,
  resendEmail,
  verifyEmail,
  logout,
} from '../controllers/auth.controller.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/reset-password', resetPassword)
router.post('/verify-reset-code', verifyResetCode)
router.post('/update-password', updatePassword)
router.get('/refresh-token', refreshAuthToken)
router.post('/logout', authMiddleware(), logout)

// Protected Routes
router.get('/resend-email', authMiddleware(), resendEmail)
router.post('/verify-email', authMiddleware(), verifyEmail)

export default router
