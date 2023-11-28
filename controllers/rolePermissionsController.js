const prisma = require('../utils/prisma')
const asyncHandler = require('express-async-handler')
const {
  rolePermissionsValidator,
} = require('../validators/rolePermissionsValidator')

/*
  @route    GET: /role-permissions
  @access   private
  @desc     Get all roles with permissions
*/
const rolePermissions = asyncHandler(async (req, res, next) => {
  const rolePermissions = await prisma.roles.findMany({
    include: {
      role_permissions: {
        include: {
          permissions: true,
        },
      },
    },
  })

  const formattedRolePermissions = rolePermissions.map(
    ({ id, name, created_at, updated_at, role_permissions }) => {
      return {
        id,
        role: name,
        created_at,
        updated_at,
        permissions: role_permissions.map(
          (permission) => permission.permissions
        ),
      }
    }
  )

  res.json(formattedRolePermissions)
})

/*
  @route    POST: /roles
  @access   private
  @desc     Create a role with permissions
*/
const createRolePermissions = asyncHandler(async (req, res, next) => {})

/*
  @route    POST: /roles
  @access   private
  @desc     Update a role with permissions
*/
const updateRolePermissions = asyncHandler(async (req, res, next) => {})

module.exports = {
  rolePermissions,
  createRolePermissions,
  updateRolePermissions,
}
