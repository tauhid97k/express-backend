const express = require('express')
const router = express.Router()
const {
  register,
  login,
  refreshAuthToken,
  authUser,
  logout,
} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/refresh', refreshAuthToken)
router.get('/user', authUser)
router.post('/logout', logout)

module.exports = router
