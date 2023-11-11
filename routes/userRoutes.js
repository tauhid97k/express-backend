const express = require('express')
const router = express.Router()
const { users } = require('../controllers/userController')

router.get('/', users)

module.exports = router
