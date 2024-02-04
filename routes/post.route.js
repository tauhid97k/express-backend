import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getPosts,
  createPost,
  deletePost,
} from '../controllers/post.controller.js'

const router = express.Router()

router.get('/', authMiddleware(), getPosts)
router.post('/', authMiddleware(), createPost)
router.delete('/:id', authMiddleware(), deletePost)

export default router
