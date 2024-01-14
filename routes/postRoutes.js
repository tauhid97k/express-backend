const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const postController = require('../controllers/postController')

router.get('/', authMiddleware(), postController.getPosts)
router.post('/', authMiddleware(), postController.createPost)
router.delete('/:id', authMiddleware(), postController.deletePost)

module.exports = router
