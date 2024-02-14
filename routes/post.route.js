import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js'

const router = express.Router()

router.get('/', authMiddleware(), getPosts)
router.get('/:id', authMiddleware(), getPost)
router.post('/', authMiddleware(), createPost)
router.put('/:id', authMiddleware(), updatePost)
router.delete('/:id', authMiddleware(), deletePost)

export default router
