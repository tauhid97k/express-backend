import * as yup from 'yup'
import prisma from '../config/db.config.js'

const rolePermissionsValidator = yup.object({
  role: yup
    .string()
    .required('Role is required')
    .test('unique', 'Role already exists', async (value) => {
      const role = await prisma.roles.findUnique({
        where: {
          name: value,
        },
      })

      return role ? false : true
    }),
  permissions: yup
    .array(yup.number().typeError('Permission must be an id'))
    .required('At least one permission is required')
    .test('exist', 'One or more permissions are invalid', async (values) => {
      const checkPermissions = await prisma.permissions.findMany({
        where: {
          id: {
            in: values,
          },
        },
      })

      return checkPermissions.length === values.length
    }),
})

const updateRolePermissionsValidator = yup.object({
  role: yup
    .string()
    .required('Role is required')
    .test('exist', 'Role does not exist', async (value) => {
      const role = await prisma.roles.findUnique({
        where: {
          name: value,
        },
      })

      return role ? true : false
    }),
  permissions: yup
    .array(yup.number().typeError('Permission must be an id'))
    .required('At least one permission is required')
    .test('exist', 'One or more permissions are invalid', async (values) => {
      const checkPermissions = await prisma.permissions.findMany({
        where: {
          id: {
            in: values,
          },
        },
      })

      return checkPermissions.length === values.length
    }),
})

export { rolePermissionsValidator, updateRolePermissionsValidator }
