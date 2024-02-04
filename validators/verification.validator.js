import * as yup from 'yup'
import prisma from '../config/db.config.js'

const emailVerifyValidator = yup.object({
  code: yup
    .number()
    .required('Code is required')
    .typeError('Code must be a number'),
  token: yup.string().required('Token is required'),
})

const passwordResetValidator = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid')
    .test('exist', 'Email does not exist', async (value) => {
      const email = await prisma.users.findUnique({
        where: {
          email: value,
        },
      })

      return !!email
    }),
})

const resetCodeVerifyValidator = yup.object({
  code: yup
    .number()
    .required('Code is required')
    .typeError('Code must be a number'),
  token: yup.string().required('Token is required'),
})

const passwordUpdateValidator = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

export {
  emailVerifyValidator,
  passwordResetValidator,
  resetCodeVerifyValidator,
  passwordUpdateValidator,
}
