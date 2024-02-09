import * as yup from 'yup'
import prisma from '../config/db.config.js'

const registerValidator = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid')
    .test('unique', 'Email already exists', async (value) => {
      const email = await prisma.users.findUnique({
        where: {
          email: value,
        },
      })

      return email ? false : true
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  role: yup.string().optional(),
})

export default registerValidator
