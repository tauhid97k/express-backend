const express = require('express')
const router = express.Router()
const verifyJWT = require('../middlewares/verifyJWTMiddleware')
const { rolePermissions } = require('../controllers/rolePermissionsController')

// Protected Routes
router.use(verifyJWT)
router.get('/', rolePermissions)

module.exports = router
