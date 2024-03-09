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
router.get('/:slug', authMiddleware(), getPost)
router.post('/', createPost)
router.put('/:slug', authMiddleware(), updatePost)
router.delete('/:slug', authMiddleware(), deletePost)

export default router
