const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const postController = require('../controllers/postController')

router.use(authMiddleware)
router.get('/', postController.getPosts)
router.post('/', postController.createPost)
router.delete('/:id', postController.deletePost)

module.exports = router
