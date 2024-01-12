const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const authController = require('../controllers/authController')

// Public routes
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/reset-password', authController.resetPassword)
router.post('/verify-reset-code', authController.verifyResetCode)
router.post('/update-password', authController.updatePassword)
router.get('/refresh-token', authController.refreshAuthToken)

// Protected Routes
router.use(authMiddleware)
router.get('/resend-email', authController.resendEmail)
router.post('/verify-email', authController.verifyEmail)
router.get('/user', authController.authUser)
router.post('/logout', authController.logout)
router.post('/logout-all', authController.logoutAll)

module.exports = router
