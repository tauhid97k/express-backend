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
  // Check if any old cookie exist (delete it)
  const cookies = req.cookies
  if (cookies?.express_jwt) {
    res.clearCookie('express_jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })
  }

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
      // Generate JWT Access Token
      const accessToken = jwt.sign(
        {
          user: {
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2m' }
      )

      // Generate JWT Refresh Token
      const refreshToken = jwt.sign(
        {
          user: {
            email: user.email,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      )

      // JWT expiry
      const jwtExpireTime = jwt.decode(refreshToken, { complete: true }).payload
        .exp

      // Save refresh token to database
      await tx.personal_tokens.create({
        data: {
          user_id: user.id,
          refresh_token: refreshToken,
          expires_at: jwtExpireTime,
        },
      })

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

  // Check if tokens exist
  const tokens = await prisma.personal_tokens.findMany({
    where: {
      refresh_token: refreshToken,
    },
  })

  // Delete current cookie
  res.clearCookie('express_jwt', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  })

  // Possible reuse of refresh token detection
  if (!tokens.length) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (error, decoded) => {
        if (error) return res.status(403).json({ message: 'Forbidden' })

        // Check if user exist
        const possibleCompromisedUser = await prisma.users.findUnique({
          where: {
            email: decoded.user.email,
          },
        })

        // If user exist, delete all related tokens
        if (possibleCompromisedUser) {
          await prisma.personal_tokens.deleteMany({
            where: {
              user_id: possibleCompromisedUser.id,
            },
          })
        }
      })
    )

    // Don't let go further
    return res.status(403).json({ message: 'Forbidden' })
  }

  // If token exist, verify the token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      if (error) return res.status(403).json({ message: 'Forbidden' })

      // Get current user
      const user = await prisma.users.findUnique({
        where: {
          email: decoded.user.email,
        },
      })

      if (!user) return res.status(401).json({ message: 'Unauthorized' })

      // Delete current refresh token from database
      await prisma.personal_tokens.deleteMany({
        where: {
          refresh_token: refreshToken,
        },
      })

      // New JWT Access Token
      const newAccessToken = jwt.sign(
        {
          user: {
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2m' }
      )

      // New JWT Refresh Token
      const newRefreshToken = jwt.sign(
        {
          user: {
            email: user.email,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      )

      // JWT expiry
      const jwtExpireTime = jwt.decode(newRefreshToken, { complete: true })
        .payload.exp

      // Save refresh token to database
      await prisma.personal_tokens.create({
        data: {
          user_id: user.id,
          refresh_token: newRefreshToken,
          expires_at: jwtExpireTime,
        },
      })

      // Create new secure cookie with refresh token
      res.cookie('express_jwt', newRefreshToken, {
        httpOnly: true, // Accessible only by server
        secure: false, // https
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.json({ accessToken: newAccessToken })
    })
  )
})

/*
  @route    GET: /user
  @access   private
  @desc     Auth user
*/
const authUser = asyncHandler(async (req, res, next) => {
  // Need some work
})

/*
  @route    POST: /logout
  @access   private
  @desc     Logout auth user (remove cookie)
*/
const logout = asyncHandler(async (req, res, next) => {
  await prisma.$transaction(async (tx) => {
    const cookies = req.cookies
    if (!cookies?.express_jwt)
      return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.express_jwt

    // Delete refresh token from database
    await tx.personal_tokens.deleteMany({
      where: {
        refresh_token: refreshToken,
      },
    })

    // Clear cookie
    res.clearCookie('express_jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })

    res.json({
      message: 'You are now logged out',
    })
  })
})

/*
  @route    POST: /logout-all
  @access   private
  @desc     Logout user's all devices
*/
const logoutAll = asyncHandler(async (req, res, next) => {})

module.exports = {
  register,
  login,
  refreshAuthToken,
  authUser,
  logout,
  logoutAll,
}
