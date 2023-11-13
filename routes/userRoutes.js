const express = require('express')
const router = express.Router()
const verifyJWT = require('../middlewares/verifyJWTMiddleware')
const { users } = require('../controllers/userController')

router.use(verifyJWT)
router.get('/', users)

module.exports = router
