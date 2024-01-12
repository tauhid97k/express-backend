const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {
  rolePermissions,
  createRolePermissions,
  updateRolePermissions,
} = require('../controllers/rolePermissionsController')

// Protected Routes
router.use(authMiddleware)
router.get('/', rolePermissions)
router.post('/', createRolePermissions)
router.put('/', updateRolePermissions)

module.exports = router
