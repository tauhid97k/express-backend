const yup = require('yup')
const prisma = require('../utils/prisma')

const rolePermissionsValidator = yup.object({
  role: yup
    .number()
    .typeError('Role must be an id')
    .required('Role is required')
    .test('unique', 'Role already exist', async (value) => {
      const role = await prisma.users.findUnique({
        where: {
          id: value,
        },
      })

      if (role) return false
      else return true
    }),
  permissions: yup
    .array(yup.number().typeError('Permission must be an id'))
    .min(1, 'Minimum one permission is required'),
})

module.exports = { rolePermissionsValidator }
