const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma')

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
    })

    // Check if user is suspended
    if (user.is_suspended)
      return res.json({ message: 'Your account is suspended' })

    // Check if user is verified
    if (!user.email_verified_at) {
      return res.json({ message: 'Your email is not verified' })
    }

    req.user = decoded.user.email

    next()
  })
}

module.exports = verifyJWT
