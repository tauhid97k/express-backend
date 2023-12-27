const express = require('express')
const router = express.Router()
const verifyAuth = require('../middlewares/authMiddleware')
const { getPosts, createPost } = require('../controllers/postController')

router.use(verifyAuth)
router.get('/', getPosts)
router.post('/', createPost)

module.exports = router
