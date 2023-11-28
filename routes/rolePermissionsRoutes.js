const express = require('express')
const router = express.Router()
const verifyAuth = require('../middlewares/authMiddleware')
const { rolePermissions } = require('../controllers/rolePermissionsController')

// Protected Routes
router.use(verifyAuth)
router.get('/', rolePermissions)

module.exports = router
