const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const createError = require('../utils/errorHandler')
const registerValidator = require('../validators/registerValidator')
const loginValidator = require('../validators/loginValidator')

/*
  @route    POST: /register
  @access   public
  @desc     New user registration
*/
const register = asyncHandler(async (req, res, next) => {
  const data = await registerValidator.validate(req.body, { abortEarly: false })

  // Encrypt password
  data.password = await bcrypt.hash(data.password, 10)

  // Create new user
  await prisma.users.create({ data })

  // Send a verification code to email
  // codes...

  res.status(201).json({
    message: 'Account created',
  })
})

/*
  @route    POST: /login
  @access   public
  @desc     User login
*/
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = await loginValidator.validate(req.body, {
    abortEarly: false,
  })

  await prisma.$transaction(async (tx) => {
    const user = await tx.users.findUnique({
      where: {
        email,
      },
    })

    // Validate Password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    // Check user
    if (email === user.email && isPasswordValid) {
      // JWT Access Token
      const accessToken = jwt.sign(
        {
          user: {
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m' }
      )

      // JWT Refresh Token
      const refreshToken = jwt.sign(
        {
          user: {
            email: user.email,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      )

      // Create secure cookie with refresh token
      res.cookie('express_jwt', refreshToken, {
        httpOnly: true, // Accessible only by server
        secure: false, // https
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json({
        accessToken,
      })
    } else {
      throw new createError(401, 'Invalid email or password')
    }
  })
})

/*
  @route    GET: /refresh
  @access   public
  @desc     Generate access token (because access token has expired)
*/
const refreshAuthToken = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies
  if (!cookies?.express_jwt)
    return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookies.express_jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      if (error) return res.status(403).json({ message: 'Forbidden' })

      const user = await prisma.users.findUnique({
        where: {
          email: decoded.user.email,
        },
      })

      if (!user) return res.status(401).json({ message: 'Unauthorized' })

      // JWT Access Token
      const accessToken = jwt.sign(
        {
          user: {
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m' }
      )

      res.json({ accessToken })
    })
  )
})

/*
  @route    GET: /user
  @access   private
  @desc     Auth user
*/
const authUser = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies
  if (!cookies?.express_jwt)
    return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookies.express_jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      if (error) return res.status(403).json({ message: 'Forbidden' })

      const user = await prisma.users.findUnique({
        where: {
          email: decoded.user.email,
        },
      })

      if (!user) return res.status(401).json({ message: 'Unauthorized' })
      res.json({ user })
    })
  )
})

/*
  @route    POST: /logout
  @access   private
  @desc     Logout auth user (remove cookie)
*/
const logout = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies
  if (!cookies?.express_jwt)
    return res.status(401).json({ message: 'Unauthorized' })

  res.clearCookie('express_jwt', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  })

  res.json({
    message: 'You are now logged out',
  })
})

module.exports = { register, login, refreshAuthToken, authUser, logout }
