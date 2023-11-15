const express = require('express')
const router = express.Router()

// Test Routes
router.use('/test', require('./testRoutes'))

// Routes
router.use('/auth', require('./authRoutes'))
router.use('/users', require('./userRoutes'))

module.exports = router
