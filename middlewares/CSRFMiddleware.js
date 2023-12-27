const crypto = require('node:crypto')

// Generate CSRF Token
const generateCSRF = (req, res, next) => {
  // Generate a CSRF token and store it in a cookie
  const csrfToken = crypto.randomBytes(48).toString('hex')
  res.cookie('csrfToken', csrfToken, {
    httpOnly: true,
    secure: false, // https
    sameSite: 'lax',
  })

  // Make the CSRF token available in the response locals for use in views
  res.locals.csrf = csrfToken
  next()
}

// Verify CSRF Token
const verifyCSRF = (req, res, next) => {
  // Skip validation for safe methods (GET, HEAD, OPTIONS)
  if (
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    req.method === 'OPTIONS'
  ) {
    return next()
  }

  // Extract CSRF token from the request
  const csrfTokenHeader = req.headers['X-CSRF-TOKEN']

  if (!csrfTokenHeader || csrfTokenHeader !== req.cookies.csrfToken) {
    return res.status(403).json({
      message: 'CSRF token mismatch',
    })
  }

  next()
}

// Check required CSRF for POST, PUT and DELETE Method
const requireCSRF = (req, res, next) => {
  if (
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE'
  ) {
    verifyCSRF(req, res, next)
  } else {
    next()
  }
}

module.exports = { generateCSRF, verifyCSRF, requireCSRF }
