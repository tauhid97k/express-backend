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
const createRolePermissions = asyncHandler(async (req, res, next) => {
  const { role, permissions } = await rolePermissionsValidator.validate(
    req.body,
    {
      abortEarly: false,
    }
  )

  await prisma.$transaction(async (tx) => {
    // Create Role
    const addRole = await tx.roles.create({
      data: {
        name: role,
      },
    })

    // Format Role and Permissions for Database
    const formattedRolePermissions = permissions.map((permission) => {
      return { role_id: addRole.id, permission_id: permission }
    })

    // Create Role and their permissions
    await tx.role_permissions.createMany({
      data: formattedRolePermissions,
    })

    res.json({ message: 'Role and permissions are created' })
  })
})

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
