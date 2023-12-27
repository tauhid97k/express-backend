const express = require('express')
const router = express.Router()

// Test Routes
router.use('/test', require('./testRoutes'))

// Routes
router.use('/role-permissions', require('./rolePermissionsRoutes'))
router.use('/auth', require('./authRoutes'))
router.use('/users', require('./userRoutes'))
router.use('/posts', require('./postRoutes'))

module.exports = router
