import express from 'express'
const router = express.Router()
import authRoutes from './auth.route.js'
import userRoutes from './user.route.js'
import rolePermissionsRoutes from './rolePermissions.route.js'
import postRoutes from './post.route.js'

// Routes
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/role-permissions', rolePermissionsRoutes)
router.use('/posts', postRoutes)

export default router
