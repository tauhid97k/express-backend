const prisma = require('../utils/prisma')
const asyncHandler = require('express-async-handler')
const registerValidator = require('../validators/registerValidator')

const register = asyncHandler(async (req, res, next) => {})

const login = asyncHandler(async (req, res, next) => {})

const logout = asyncHandler(async (req, res, next) => {})

module.exports = { register, login, logout }
