const express = require('express')
const router = express.Router()
const {
  register,
  login,
  refreshAuthToken,
  authUser,
  logout,
  logoutAll,
} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/refresh', refreshAuthToken)
router.get('/user', authUser)
router.post('/logout', logout)
router.post('/logout-all', logoutAll)

module.exports = router
