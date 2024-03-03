import express from 'express'
const router = express.Router()
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getRoles,
  getPermissions,
  getRolePermissions,
  createRolePermissions,
  updateRolePermissions,
} from '../controllers/rolePermissions.controller.js'

// Protected Routes
router.get('/roles', authMiddleware(), getRoles)
router.get('/permissions', authMiddleware(), getPermissions)
router.get('/', authMiddleware(), getRolePermissions)
router.post('/', authMiddleware(), createRolePermissions)
router.put('/', authMiddleware(), updateRolePermissions)

export default router
