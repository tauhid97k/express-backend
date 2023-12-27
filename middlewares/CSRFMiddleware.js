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

  // Extract CSRF token cookie from the request
  const csrfTokenCookie = req.cookies.csrfToken

  if (!csrfTokenCookie || csrfTokenCookie !== req.cookies.csrfToken) {
    return res.status(403).json({
      message: 'CSRF token mismatch',
    })
  }

  next()
}

module.exports = { requireCSRF, verifyCSRF }
