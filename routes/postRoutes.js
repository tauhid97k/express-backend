const express = require('express')
const router = express.Router()
const verifyAuth = require('../middlewares/authMiddleware')
const {
  getPosts,
  createPost,
  deletePost,
} = require('../controllers/postController')

router.use(verifyAuth)
router.get('/', getPosts)
router.post('/', createPost)
router.delete('/:id', deletePost)

module.exports = router
