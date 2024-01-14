const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const authController = require('../controllers/authController')

// Public routes
router.post('/register', authController.register)
router.post('/reset-password', authController.resetPassword)
router.post('/verify-reset-code', authController.verifyResetCode)
router.post('/update-password', authController.updatePassword)
router.get('/refresh-token', authController.refreshAuthToken)
router.post('/login', authController.login)
router.post('/logout-all', authController.logoutAll)

// Protected Routes
router.get('/user', authMiddleware(), authController.authUser)
router.get('/resend-email', authMiddleware(), authController.resendEmail)
router.post('/verify-email', authMiddleware(), authController.verifyEmail)
router.post('/logout', authMiddleware(), authController.logout)

module.exports = router
