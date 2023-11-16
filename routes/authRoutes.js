const express = require('express')
const router = express.Router()
const verifyJWT = require('../middlewares/verifyJWTMiddleware')
const {
  register,
  login,
  refreshAuthToken,
  authUser,
  logout,
  logoutAll,
} = require('../controllers/authController')

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected Routes
router.use(verifyJWT)
router.get('/refresh', refreshAuthToken)
router.get('/user', authUser)
router.post('/logout', logout)
router.post('/logout-all', logoutAll)

module.exports = router
