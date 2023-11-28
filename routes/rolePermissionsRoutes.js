const express = require('express')
const router = express.Router()
const verifyAuth = require('../middlewares/authMiddleware')
const {
  rolePermissions,
  createRolePermissions,
} = require('../controllers/rolePermissionsController')

// Protected Routes
router.use(verifyAuth)
router.get('/', rolePermissions)
router.post('/', createRolePermissions)

module.exports = router
