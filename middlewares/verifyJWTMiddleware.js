const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma')
const dayjs = require('dayjs')

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
    if (error) return res.status(403).json({ message: 'Forbidden' })
    const user = await prisma.users.findUnique({
      where: {
        email: decoded.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        email_verified_at: true,
        created_at: true,
      },
    })

    // Format dates
    user.email_verified_at = dayjs(user.created_at).format('DD MMM YYYY')
    user.created_at = dayjs(user.created_at).format('DD MMM YYYY')

    // Check if user is suspended
    if (user.is_suspended)
      return res.json({ message: 'Your account is suspended' })

    // Check if user is verified
    if (!user.email_verified_at) {
      return res.json({ message: 'You must verify your email' })
    }

    req.user = user

    next()
  })
}

module.exports = verifyJWT
