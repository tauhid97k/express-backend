import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { getUser } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', authMiddleware(), getUser)

export default router
