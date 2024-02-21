import express from 'express'
const router = express.Router()
import authMiddleware from '../middlewares/auth.middleware.js'
import { getUser } from '../controllers/user.controller.js'

router.get('/', authMiddleware(), getUser)

export default router
