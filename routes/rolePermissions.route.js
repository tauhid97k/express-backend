import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  rolePermissions,
  createRolePermissions,
  updateRolePermissions,
} from '../controllers/rolePermissions.controller.js'

// Protected Routes
const router = express.Router()

router.get('/', authMiddleware(), rolePermissions)
router.post('/', authMiddleware(), createRolePermissions)
router.put('/', authMiddleware(), updateRolePermissions)

export default router
