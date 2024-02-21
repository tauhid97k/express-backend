import express from 'express'
const router = express.Router()
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js'

router.get('/', getPosts)
router.get('/:id', authMiddleware(), getPost)
router.post('/', authMiddleware(), createPost)
router.put('/:id', authMiddleware(), updatePost)
router.delete('/:id', authMiddleware(), deletePost)

export default router
