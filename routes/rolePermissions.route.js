import express from 'express'
const router = express.Router()
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  rolePermissions,
  createRolePermissions,
  updateRolePermissions,
} from '../controllers/rolePermissions.controller.js'

// Protected Routes
router.get('/', authMiddleware(), rolePermissions)
router.post('/', authMiddleware(), createRolePermissions)
router.put('/', authMiddleware(), updateRolePermissions)

export default router
